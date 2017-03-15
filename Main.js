var synth = new AudioEngine.Synth(AudioEngine.EPiano);

var opts = {
	timeSig: [4, 4],
	bpm: 120,
	noteRange: ['C4', 'C5'],
};

var gen = new AudioEngine.MusicGenerator(opts);
var mp = new AudioEngine.MusicPlayer(synth);
mp.queueBar(gen.nextBar(), opts);
mp.start();

setInterval(function() {
	console.log(mp.queue.length);
	mp.queueBar(gen.nextBar(), opts);
}, Math.ceil(AudioEngine.barDurSec(opts.bpm, opts.timeSig) * 1000));

console.log(JSON.stringify(mp.queue, null, 3));