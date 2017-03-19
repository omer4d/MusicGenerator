var fs = require('fs');
var MidiWriter = require('midi-writer-js');

function writeMidi(track, name) {
	var write = new MidiWriter.Writer([track]);
	
	fs.writeFile(name, new Buffer(write.buildFile()),  "binary", function(err) {
		if(err) {
			console.log(err);
		}
	});
}


function randi(min, max) {
	return Math.floor(min + Math.random() * (max - min));
}

var notes = ["C4", "D4", "E4"];

function genMelody() {
	var melody = [];
	
	for(var i = 0; i < 4; ++i) {
		melody.push(randi(0, 3));
	}
	
	return melody;
}

function checkMelody(melody) {
	return true;
}

function gen() {
	var track = new MidiWriter.Track();
	track.setTempo(80);
	track.setTimeSignature(4, 4);
	track.addEvent(new MidiWriter.ProgramChangeEvent({instrument : 1}));
	
	for(var j = 0; j < 10000; ++j) {
		var melody = genMelody();
		
		if(checkMelody(melody)) {
			for(var i = 0; i < melody.length; ++i) {
				var note = new MidiWriter.NoteEvent({pitch:[notes[melody[i]]], duration: "4"});
				track.addEvent(note);
			}
			break;
		}
	}

	writeMidi(track, melody.reduce(function(name, idx) {
		return name + notes[idx].charAt(0);
	}, "1bar-output/") + ".midi");
}

for(var i = 0; i < 30; ++i)
	gen();