















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