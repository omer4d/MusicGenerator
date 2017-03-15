function MusicPlayer(synth) {
	this.synth = synth;
  this.queue = [];
  this.time = 0;
  this.lastBarEndTime = 0;
}

MusicPlayer.prototype.queueBar = function(bar, opts) {
	var time = this.lastBarEndTime;
  var tdur = function(dur, aug) {
  	var dt = (60 / opts.bpm) * (opts.timeSig[1] / dur);
  	return aug ? dt + dt/2 : dt;
  };
  var tmp = [];

	for(var i = 0; i < bar.length; ++i) {
  	if(bar[i].type === "notes") {
    	var dt = tdur(bar[i].notes[0].dur, bar[i].notes[0].aug);
      
      for(var j = 0; j < bar[i].notes.length; ++j) {
      	var n = bar[i].notes[j].num;
      	var noteNum = [0, 2, 4, 5, 7, 9, 11][n % 7] + Math.floor(n / 7) * 12;
      
      	tmp.push({time: time, type: "noteOn", noteNum: noteNum});
        tmp.push({time: time + dt, type: "noteOff", noteNum: noteNum});
      }
      
      time += dt;
    }else if(bar[i].type === "rest") {
    	time += tdur(bar[i].dur, bar[i].aug);
    }
  }
  
  //tmp.sort(function(e1, e2) {
  //	return e1.time - e2.time;
  //});
  
  for(var i = 0; i < tmp.length; ++i) {
  	this.queue.push(tmp[i]);
  }
  
  this.lastBarEndTime = time;
}

MusicPlayer.prototype.tick = function(dt) {
	var queue = this.queue;
  var time = this.time;

//	for(var i = 0; i < queue.length /*&& queue[i].time <= time*/; ++i) {
//  	if(queue[i].time <= time) {
//      if(queue[i].type === "noteOn") {
//        this.synth.noteOn(queue[i].noteNum);
//        }
//      else if(queue[i].type === "noteOff")
//        this.synth.noteOff(queue[i].noteNum);
//      }
//  }

	for(var i = queue.length - 1; i >= 0; --i) {
  
  	if(queue[i].time <= time) {
      if(queue[i].type === "noteOn") {
        this.synth.noteOn(queue[i].noteNum);
        }
      else if(queue[i].type === "noteOff")
        this.synth.noteOff(queue[i].noteNum);
     	queue.splice(i, 1);
    }
  }
  
	this.time += dt;
};