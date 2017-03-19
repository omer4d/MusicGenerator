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

module.exports = {
	match: match,
	matchAll: matchAll,
	countMatches: countMatches
};