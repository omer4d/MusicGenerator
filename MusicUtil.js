(function(AudioEngine) {
	function randi(min, max) {
        return Math.floor(min + Math.random() * (max - min));
    };
	
	function noteNameToNum(name) {
        var n = name.charCodeAt(0) - 'C'.charCodeAt(0);
        return (n < 0 ? 7 + n : n) + (name.charCodeAt(1) - '0'.charCodeAt(0)) * 7;
    };

	function noteNumToName(num) {
        return ["C", "D", "E", "F", "G", "A", "B"][num % 7] + Math.floor(num / 7);
    };

    function randomNote(min, max) {
        return randi(noteNameToNum(min), noteNameToNum(max) + 1);
    };
	
	function noteDurSec(bpm, timeSig, dur, aug) {
		var dt = (60 / bpm) * (timeSig[1] / dur);
        return aug ? dt + dt / 2 : dt;
	};
	
	function barDurSec(bpm, timeSig) {
		return 60 / opts.bpm*opts.timeSig[0];
	};
	
	AudioEngine.randi = randi;
	AudioEngine.noteNameToNum = noteNameToNum;
	AudioEngine.noteNumToName = noteNumToName;
	AudioEngine.randomNote = randomNote;
	AudioEngine.noteDurSec = noteDurSec;
	AudioEngine.barDurSec = barDurSec;
	
}(window.AudioEngine = window.AudioEngine || {}));