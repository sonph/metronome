import * as utils from './utils.js';

const BEEP = 'beep';
// Duration of beep in seconds.
const BEEP_DURATION = 0.05;

class Audio {
  constructor() {
    /** @type {!AudioContext} */
    this.audioContext = new AudioContext();
    /** @type {boolean} Whether audio context has been unlocked. */
    this.unlocked = false;

    this.sampleUrlsMap = {
      'hihat': 'static/sounds/hihat.wav'
    };

    // Map name to buffer.
    this.buffers = {};

    this.uiData = {
      sampleName: BEEP,
    }
  }

  // Play silent buffer to unlock the audio.
  unlockAudio() {
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

  getUiData() {
    return this.uiData;
  }

  /**
   * Schedule the sound at startTime. beatNumber from 0 to 15 (16th notes).
   */
  scheduleSound(beatNumber, noteTime) {
    // console.log('[audio.js] scheduleSound()');
    console.log(utils.sprintf(
        '[audio.js] schedule time diff: $ - $ = $',
        noteTime, this.audioContext.currentTime,
        noteTime - this.audioContext.currentTime));
    if (this.uiData.sampleName == BEEP) {
      let freq;
      if (beatNumber % 16 === 0) {  // beat 0 = high pitch
        freq = 880.0;
      } else if (beatNumber % 4 === 0) {  // quarter notes = medium pitch
        freq = 440.0;
      } else {  // other 16th notes = low pitch
        freq = 220.0;
      }
      let osc = this.audioContext.createOscillator();
      osc.connect(this.audioContext.destination);
      osc.frequency.value = freq;
      osc.start(noteTime);
      osc.stop(noteTime + BEEP_DURATION);
    } else {
      if (!(this.uiData.sampleName in this.buffers)) {
        console.warn(
            '[audio.js] sample not in sample map: ' + this.uiData.sampleName);
        return;
      }
      let node = this.audioContext.createBufferSource();
      node.buffer = this.buffers[this.uiData.sampleName];
      node.connect(this.audioContext.destination);
      node.start(noteTime);
    }
  }

  maybeLoadSample() {
    if (this.uiData.sampleName == BEEP) {
      return;
    }
    // Only load new sample if it hasn't been loaded before.
    if (!(this.uiData.sampleName in this.buffers)) {
      console.log('[audio.js] Loading sample for ' + this.uiData.sampleName);
      new BufferLoader(this.audioContext, [this.uiData.sampleName], this.sampleUrlsMap, (buffers) => {
        Object.keys(buffers).forEach((key, index) => {
          // Insert the fetched buffer along with existing buffers, so we don't
          // re-load.
          this.buffers[key] = buffers[key];
        });
      }).load();
    }
  }

  loadSamples() {
  }
}

class BufferLoader {
  constructor(context, sampleNames, sampleUrlsMap, callback) {
    this.context = context;
    this.sampleNames = sampleNames;
    this.sampleUrlsMap = sampleUrlsMap;
    this.onload = callback;
    this.buffers = {};
    this.loadCount = 0;
  }

  load() {
    for (var i = 0; i < this.sampleNames.length; ++i) {
      this.loadBuffer(this.sampleNames[i]);
    }
  }

  loadBuffer(sampleName) {
    let url = this.sampleUrlsMap[sampleName];
    // Load buffer asynchronously
    let request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    let loader = this;

    request.onload = function() {
      // Asynchronously decode the audio file data in request.response
      loader.context.decodeAudioData(
        request.response,
        function(buffer) {
          if (!buffer) {
            alert('error decoding file data: ' + url);
            return;
          }
          loader.buffers[sampleName] = buffer;
          if (++loader.loadCount == loader.sampleNames.length)
            loader.onload(loader.buffers);
        },
        function(error) {
          console.error('decodeAudioData error', error);
        }
      );
    }

    request.onerror = function() {
      alert('BufferLoader: XHR error');
    }

    request.send();
  }
}

export {Audio};
