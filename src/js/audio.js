class Audio {
  constructor() {
    /** @type {!AudioContext} */
    this.audioContext = new AudioContext();
    /** @type {boolean} Whether audio context has been unlocked. */
    this.unlocked = false;
  }

  // Play silent buffer to unlock the audio.
  unlockAudio() {
    // TODO(sonph): Maybe move this into play() function, only
    // unlock audio when user presses play for the first time.
    console.log('[audio.js] unlock audio');
    if (!this.unlocked) {
      var buffer = this.audioContext.createBuffer(1, 1, 22050);
      var node = this.audioContext.createBufferSource();
      node.buffer = buffer;
      node.start(0);
      this.unlocked = true;
    }
  }

  getAudioContext() {
    return this.audioContext;
  }

  beep(freq, startTime, stopTime) {
    console.log('[audio.js] beep()');
    var osc = this.audioContext.createOscillator();
    osc.connect(this.audioContext.destination);
    osc.frequency.value = freq;
    osc.start(startTime);
    osc.stop(stopTime);
  }

  loadAudioFiles() {
  }
}

export {Audio};