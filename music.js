function isPow2(x) {
  var y = Math.log(x) / Math.log(2);
  return y >= 0 && y === Math.floor(y);
}

function MusicGenerator(opts) {
  this.opts = opts;
  if(!isPow2(opts.timeSig[1]) || opts.timeSig < 1 || opts.timeSig[1] > 16)
    throw new Error("Invalid time signature: " + opts.timeSig);
}

function genDurs(timeSig) {
  var sixteenths = [1, 2, 3, 4, 6, 8, 12, 16];
  var values = [16, 8, 8, 4, 4, 2, 2, 1];
  var augs = [false, false, true, false, true, false, true, false];
  
  
  
  var total = timeSig[0] * (16 / timeSig[1]);
  var out = [];
  
  while(total > 0) {
    var idx = -1; 
    do {
      idx = Math.floor(Math.random() * sixteenths.length);
    }while(sixteenths[idx] > total);
    out.push({value: values[idx], aug: augs[idx]});
    total -= sixteenths[idx];
  }
  
  return out;
}

function randi(min, max) {
	return Math.floor(min + Math.random() * (max - min));
}

function noteNameToNum(name) {
  var n = name.charCodeAt(0) - 'C'.charCodeAt(0);
  return (n < 0 ? 7 + n : n) + (name.charCodeAt(1) - '0'.charCodeAt(0)) * 7;
}

function noteNumToName(num) {
  return ["C", "D", "E", "F", "G", "A", "B"][num % 7] + Math.floor(num / 7);
}

function randomNote(min, max) {
   return randi(noteNameToNum(min), noteNameToNum(max) + 1);
}

function randomAccidental() {
  if(Math.random() < 0.1)
    return Math.random() < 0.5 ? "flat" : "sharp";
  else
    return undefined;
}

MusicGenerator.prototype.nextBar = function() {
  var bar = [];
  var durs = genDurs(this.opts.timeSig);
  
  for(var i = 0; i < durs.length; ++i) {
    if(Math.random() < 0.1 && !durs[i].aug) {
      bar.push({
        type: 'rest',
        dur: durs[i].value
      });
    }else {
      var notes = [], n = randi(1, 3);
      for(var j = 0; j < n; ++j) {
        notes.push({
          dur: durs[i].value,
          aug: durs[i].aug,
          num: randomNote(this.opts.noteRange[0], this.opts.noteRange[1]),
          accidental: randomAccidental()
        });
      }
      bar.push({
        type: 'notes',
        notes: notes
      });
    }
  }
  
  return bar;
};


function Voice(freq) {
	this.freq = freq;
  this.time = 0;
  this.decayStartTime = -1;
  this.next = null;
}

Voice.prototype.sample = function(dt) {
	var t = this.time, f = this.freq;
	var v1 = Math.sin(6.2831*f*t)*Math.exp(-3*t);
  var v2 = Math.sin(6.2831*f*2.01*t)*Math.exp(-4.0*t)*0.5*0.5;
  var v3 = Math.sin(6.2831*f*3.03*t)*Math.exp(-5.0*t)*0.5*0.5*0.5;
  var v4 = Math.sin(6.2831*f*4.01*t)*Math.exp(-3.0*t)*0.5*0.5*0.5*0.5;
 	var v5 = Math.sin(6.2831*f*0.501*t)*Math.exp(-0.5*t)*0.2;
  var v6 = Math.sin(6.2831*f*4.005*t)*Math.exp(-3.0*t)*0.5*0.5*0.5;
  var v7 = Math.sin(6.2831*f*9.1*t)*Math.exp(-11.0*t)*0.5*0.5*0.5*0.5*0.5;
	var v = (v1 + v2 + v3 + v4 + v5 + v6 + v7) * 0.5;
  this.time = t + dt;
  return this.decayStartTime < 0 ? v : v * Math.exp(-4 * t - this.decayStartTime);
}

Voice.prototype.triggerDecay = function() {
	this.decayStartTime = this.time;
}

Voice.prototype.dead = function() {
	return this.decayStartTime < 0 ? this.time > 3 : (this.time - this.decayStartTime) > 0.5;
}

function Synth(voiceConstructor) {
	this.voiceConstructor = voiceConstructor;
	this.voiceList = {next: null};
  this.keyVoices = [];
}

Synth.prototype.sample = function(dt) {
	var prevVoice = this.voiceList;
  var sum = 0;
  
	for(var voice = this.voiceList.next; voice !== null; voice = voice.next) {
  	if(voice.dead()) {
    	prevVoice.next = voice.next;
    }
    else
    	sum += voice.sample(dt);
    prevVoice = voice;
  }
  
  return sum;
}

Synth.prototype.noteOn = function(noteNum) {
	var freq = 16.3516 * Math.pow(Math.pow(2, 1/12), noteNum);
	var voice = new this.voiceConstructor(freq);
  this.noteOff(noteNum);
  voice.next = this.voiceList.next;
	this.voiceList.next = voice;
  this.keyVoices[noteNum] = voice;
}

Synth.prototype.noteOff = function(noteNum) {
	if(this.keyVoices[noteNum] && !this.keyVoices[noteNum].dead()) {
  	this.keyVoices[noteNum].triggerDecay();
    delete this.keyVoices[noteNum];
  }
}



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









var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

var node = context.createScriptProcessor(1024, 1, 1);
var t = 0;
var dt = 1/44100;
var synth = new Synth(Voice);

var opts = {
	timeSig: [4, 4],
	bpm: 60,
	noteRange: ['C4', 'C5'],
};

var gen = new MusicGenerator(opts);

var mp = new MusicPlayer(synth);
mp.queueBar(gen.nextBar(), opts);

setInterval(function() {
	console.log(mp.queue.length);
	mp.queueBar(gen.nextBar(), opts);
}, Math.ceil(60/opts.bpm*opts.timeSig[0]*1000));

//60/opts.bpm*opts.timeSig[0]*1000

//mp.queueBar(gen.nextBar(), opts);
//mp.queueBar(gen.nextBar(), opts);


console.log(JSON.stringify(mp.queue, null, 3));



node.onaudioprocess = function (e) {
  var output = e.outputBuffer.getChannelData(0);
  
  var counter = 0;
  for(var v = synth.voiceList; v !== null; v = v.next) {
  	++counter;
  }
  //console.log(counter);
  
  for (var i = 0; i < output.length; i++) {
  	 mp.tick(dt);
    	output[i] = synth.sample(dt);
  }
};
node.connect(context.destination);


//setTimeout(function() {
//	node.disconnect(context.destination);
//}, 5000);


var major = [60, 62, 64, 65, 67, 69, 71, 72];
var melodicMinor = [60, 62, 63, 65, 67, 69, 71, 72];
var harmonicMinor = [60, 62, 63, 65, 67, 68, 71, 72];
var naturalMinor = [60, 62, 63, 65, 67, 68, 70, 72];

var idx = 0;
var dir = 1;

var scales = [major, harmonicMinor];
var scale = major;
var lastNote = 0;

/*
setInterval(function() {
	//synth.triggerNote(scale[Math.floor(Math.random() * scale.length)]);
  //synth.triggerNote(scale[(idx++) % scale.length]);
  
  
  idx += Math.floor(Math.random() * 6 + 1) * dir;
  idx %= scale.length;
  if(idx < 0) idx += scale.length;
  
  if(Math.random() < 0.1)
  	dir *= -1;
  //if(Math.random() < 0.1)
  	//scale = scales[Math.floor(Math.random() * scales.length)];
  
  if(Math.random() < 0.5)
  synth.noteOff(lastNote);
  synth.noteOn(scale[idx]-12);
  lastNote = scale[idx]-12;
  
}, 200);*/

//node.disconnect(context.destination);

/*
setTimeout(function() {
	voice.triggerDecay();
  voice2.triggerDecay();
  voice3.triggerDecay();
}, 1000);*/