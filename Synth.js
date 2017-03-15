(function(AudioEngine) {
    function Synth(voiceConstructor) {
        this.voiceConstructor = voiceConstructor;
        this.voiceList = {
            next: null
        };
        this.keyVoices = [];
    }

    Synth.prototype.sample = function(dt) {
        var prevVoice = this.voiceList;
        var sum = 0;

        for (var voice = this.voiceList.next; voice !== null; voice = voice.next) {
            if (voice.dead()) {
                prevVoice.next = voice.next;
            } else
                sum += voice.sample(dt);
            prevVoice = voice;
        }

        return sum;
    }

    Synth.prototype.noteOn = function(noteNum) {
        var freq = 16.3516 * Math.pow(Math.pow(2, 1 / 12), noteNum);
        var voice = new this.voiceConstructor(freq);
        this.noteOff(noteNum);
        voice.next = this.voiceList.next;
        this.voiceList.next = voice;
        this.keyVoices[noteNum] = voice;
    }

    Synth.prototype.noteOff = function(noteNum) {
        if (this.keyVoices[noteNum] && !this.keyVoices[noteNum].dead()) {
            this.keyVoices[noteNum].triggerDecay();
            delete this.keyVoices[noteNum];
        }
    }

	
	AudioEngine.Synth = Synth;
}(window.AudioEngine = window.AudioEngine || {}));