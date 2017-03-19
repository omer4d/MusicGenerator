var synth = new AudioEngine.Synth(AudioEngine.EPiano);

var opts = {
	timeSig: [4, 4],
	bpm: 120,
	noteRange: ['C4', 'C5'],
};

function inspect(x) {
	console.log(JSON.stringify(x, null, 2));
	return x;
}

var gen = new AudioEngine.MusicGenerator(opts);
var mp = new AudioEngine.MusicPlayer(synth);


var a = inspect(gen.nextBar());
var b = inspect(gen.nextBar());










mp.queueBar(a, opts);
mp.queueBar(b, opts);

console.log("Player even queue: ");
inspect(mp.queue);

mp.start();


function zx(e){
	console.log("RESTARTING!");
	mp.restart();
	mp.queueBar(a, opts);
	mp.queueBar(b, opts);
}
document.onkeypress = zx;

/*
setInterval(function() {
	//console.log(mp.queue.length);
	mp.queueBar(gen.nextBar(), opts);
}, Math.ceil(AudioEngine.barDurSec(opts.bpm, opts.timeSig) * 1000));*/

//console.log(JSON.stringify(mp.queue, null, 3));