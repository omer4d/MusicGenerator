var fs = require('fs');
var MidiWriter = require('midi-writer-js');

var writeCounter = 0;

function writeMidi(track) {
	var write = new MidiWriter.Writer([track]);
	var name = "output/m" + (writeCounter++) + ".midi";
	
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
	
	for(var i = 0; i < 8; ++i) {
		melody.push(randi(0, 3));
	}
	
	return melody;
}

function checkMelody(melody) {
	return melody[7] === 0 &&
		   !((melody[0] === 1 && melody[1] === 0) ||  (melody[4] === 1 && melody[5] === 0)) &&
		   !((melody[0] === 1 && melody[1] === 2) ||  (melody[4] === 1 && melody[5] === 2)) &&
		   (melody[1] !== melody[2]) && (melody[5] !== melody[6]);
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

	writeMidi(track);
}

for(var i = 0; i < 30; ++i)
	gen();