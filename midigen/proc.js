var walkSync = function(dir, filelist) {
  var fs = fs || require('fs'),
      files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + file).isDirectory()) {
      filelist = walkSync(dir + file + '/', filelist);
    }
    else {
      filelist.push(file);
    }
  });
  return filelist;
};

function match(str, patt) {
  var vars = {};
  var toks = patt.split(" ").filter(function(s) {
    return s.length > 0;
  });
  
  var matchers = toks.map(function(p) {
    if(p === ".") {
      return function(_) {
        return true;
      };
    }
    
    else if(p.charAt(0) === "%") {
      var vname = p.slice(1);
      return function(ch) {
        if(!vars[vname]) {
          vars[vname] = ch;
		}
	  
        return ch === vars[vname];
      };
    }
	
	else if(p.charAt(0) === "!") {
      var vname = p.slice(1);
      return function(ch) {
        return ch !== vars[vname];
      };
    }
    
    else {
      return function(ch) {
        return ch === p;
      };
    }
  });
  
  var job = function(ch, i) {
    return matchers[i](ch);
  };
  
  var chars = str.split("");
  return matchers.length == str.length && chars.every(job) && chars.every(job);
}

function matchAll(arr, patt, exclude) {
	return arr.filter(function(s) {
		return match(s, patt) && (exclude ? exclude.every(function(expatt) {
			return !match(s, expatt);
		}) : true);
	});
}

function countMatches(arr, patt, exclude) {
	return matchAll(arr, patt, exclude).length;
}

var xooo = walkSync("1bar-output/xooo/", []).map(function(fn) {
	return fn.slice(0, 4);
});

var oxoo = walkSync("1bar-output/oxoo/", []).map(function(fn) {
	return fn.slice(0, 4);
});

var ambig = walkSync("1bar-output/ambiguous/", []).map(function(fn) {
	return fn.slice(0, 4);
});


function testPatt(patt, exclude) {
	var r = [xooo, oxoo, ambig].map(function(arr) {
		return countMatches(arr, patt, exclude);
	});
	
	console.log("(" + patt + ")    ", r);
}

var grouped = [
	"%y %y !y .",
	"%y %y %y !y",
	". !y %y %y",
	"!y %y %y !y",
	"!y %y %y %y",
];

for(var i = 0; i < grouped.length; ++i) {
	testPatt(grouped[i]);
}

console.log();

console.log(matchAll(oxoo, grouped[2]));

console.log();


var notes = ["C", "E", "D"];

for(var i = 0; i < notes.length; ++i) {
	for(var j = 0; j < notes.length; ++j) {
		if(notes[i] !== notes[j]) {
			var patt = notes[i] + " " + notes[j] + " . .";
			testPatt(patt, grouped);
		}
	}
}


console.log();

for(var i = 0; i < notes.length; ++i) {
	for(var j = 0; j < notes.length; ++j) {
		if(notes[i] !== notes[j]) {
			var patt = ". " + notes[i] + " " + notes[j] + " .";
			testPatt(patt, grouped);
		}
	}
}

console.log();

for(var i = 0; i < notes.length; ++i) {
	for(var j = 0; j < notes.length; ++j) {
		if(notes[i] !== notes[j]) {
			var patt = ". . " + notes[i] + " " + notes[j];
			testPatt(patt, grouped);
		}
	}
}



/*

testPatt();
testPatt();

console.log("");

testPatt();
testPatt();

console.log("");*/






//testPatt("!y %y %y %y");







//console.log(match("BAAB", "!x %x %x !x"));




/*
for(var i = 0; i < Math.max(Math.max(xooo.length, oxoo.length), ambig.length); ++i) {
	var s = "";
	
	s += xooo[i] ? (xooo[i] + "    ") : "        ";
	s += oxoo[i] ? (oxoo[i] + "    ") : "        ";
	s += ambig[i] ? (ambig[i] + "    ") : "        ";
	
	console.log(s);
}*/
