(function(AudioEngine) {
    function Voice(freq) {
        this.freq = freq;
        this.time = 0;
        this.decayStartTime = -1;
        this.next = null;
    }

    Voice.prototype.sample = function(dt) {
        var t = this.time,
            f = this.freq;
        var v1 = Math.sin(6.2831 * f * t) * Math.exp(-3 * t);
        var v2 = Math.sin(6.2831 * f * 2.01 * t) * Math.exp(-4.0 * t) * 0.5 * 0.5;
        var v3 = Math.sin(6.2831 * f * 3.03 * t) * Math.exp(-5.0 * t) * 0.5 * 0.5 * 0.5;
        var v4 = Math.sin(6.2831 * f * 4.01 * t) * Math.exp(-3.0 * t) * 0.5 * 0.5 * 0.5 * 0.5;
        var v5 = Math.sin(6.2831 * f * 0.501 * t) * Math.exp(-0.5 * t) * 0.2;
        var v6 = Math.sin(6.2831 * f * 4.005 * t) * Math.exp(-3.0 * t) * 0.5 * 0.5 * 0.5;
        var v7 = Math.sin(6.2831 * f * 9.1 * t) * Math.exp(-11.0 * t) * 0.5 * 0.5 * 0.5 * 0.5 * 0.5;
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
	
	AudioEngine.EPiano = Voice;
}(window.AudioEngine = window.AudioEngine || {}));