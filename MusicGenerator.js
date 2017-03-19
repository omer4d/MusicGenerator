(function(AudioEngine) {

    function isPow2(x) {
        var y = Math.log(x) / Math.log(2);
        return y >= 0 && y === Math.floor(y);
    }

    function MusicGenerator(opts) {
        this.opts = opts;
        if (!isPow2(opts.timeSig[1]) || opts.timeSig < 1 || opts.timeSig[1] > 16)
            throw new Error("Invalid time signature: " + opts.timeSig);
    }

    function genDurs(timeSig) {
        var sixteenths = [1, 2, 3, 4, 6, 8, 12, 16];
        var values = [16, 8, 8, 4, 4, 2, 2, 1];
        var augs = [false, false, true, false, true, false, true, false];
		
		//var sixteenths = [1, 2, 4, 8, 16];
        //var values = [16, 8, 4, 2, 1];
        //var augs = [false, false, false, false, false];
		
		//var sixteenths = [4, 8];
        //var values = [4, 2];
        //var augs = [false, false, false, false, false];
		
		//var sixteenths = [4];
        //var values = [4];
		//var augs = [false, false, false, false, false];

        var total = timeSig[0] * (16 / timeSig[1]);
        var out = [];

        while (total > 0) {
            var idx = -1;
            do {
                idx = Math.floor(Math.random() * sixteenths.length);
            } while (sixteenths[idx] > total);
            out.push({
                value: values[idx],
                aug: augs[idx]
            });
            total -= sixteenths[idx];
        }

		console.log(total);
        return out;
    }

    function randomAccidental() {
        if (Math.random() < 0.1)
            return Math.random() < 0.5 ? "flat" : "sharp";
        else
            return undefined;
    }

    MusicGenerator.prototype.nextBar = function() {
        var bar = [];
        var durs = genDurs(this.opts.timeSig);

        for (var i = 0; i < durs.length; ++i) {
            if (Math.random() < 0.1 && !durs[i].aug) {
                bar.push({
                    type: 'rest',
                    dur: durs[i].value
                });
            } else {
                var notes = [],
                    n = AudioEngine.randi(1, 3);
                for (var j = 0; j < n; ++j) {
                    notes.push({
                        dur: durs[i].value,
                        aug: durs[i].aug,
                        num: AudioEngine.randomNote(this.opts.noteRange[0], this.opts.noteRange[1]),
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

	AudioEngine.MusicGenerator = MusicGenerator;
}(window.AudioEngine = window.AudioEngine || {}));