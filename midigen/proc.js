var Matcher = require("./Matcher.js");

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
		return Matcher.countMatches(arr, patt, exclude);
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

console.log(Matcher.matchAll(oxoo, grouped[2]));

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
