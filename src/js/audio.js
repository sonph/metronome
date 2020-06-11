import * as utils from './utils.js';

const BEEP_LOW = 'beep low';
const BEEP_HIGH = 'beep high';
// Duration of beep in seconds.
const BEEP_DURATION = 0.05;

const GAIN_LEVEL_STORAGE_KEY = 'AUDIO_GAIN_LEVEL';
const GAIN_LEVEL_MAX_VALUE = 1.5;  // Must be in sync with HTML range input max.

class Audio {
  constructor(storage) {
    /** @type {!Storage} */
    this.storage = storage;

    /** @type {!AudioContext} */
    this.audioContext = new AudioContext({ latencyHint: 'interactive' });
    this.baseLatency = null;

    /** @type {boolean} Whether audio context has been unlocked. */
    this.unlocked = false;

    this.sampleUrlsMap = {
      'hihat': 'static/sounds/hihat.wav'
    };

    // Map name to buffer.
    this.buffers = {};

    this.uiData = {
      sampleName: BEEP_HIGH,
      gainNode: this.audioContext.createGain()
    }

    this.uiData.gainNode.gain.value = Math.min(
        this.storage.get(GAIN_LEVEL_STORAGE_KEY) || 1.0,
        GAIN_LEVEL_MAX_VALUE);
    this.uiData.gainNode.connect(this.audioContext.destination);
  }

  // Play silent buffer to unlock the audio.
  unlockAudio() {
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

  /**
   * Returns audioContext.baseLatency.
   *
   * .baseLatency is not supported in a few browsers, including Safari and
   * Firefox-on-Android.
   * See https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/baseLatency
   */
  getBaseLatency() {
    if (this.baseLatency !== null) {
      return this.baseLatency;
    }
    if (this.audioContext.state === 'running') {
      this.baseLatency = this.audioContext.baseLatency || 0;
      utils.log('AudioContext base latency: $ secs',
          this.baseLatency.toFixed(6));
      return this.baseLatency;
    }
    return 0;
  }

  getUiData() {
    return this.uiData;
  }

  /**
   * Schedule the sound at startTime. beatNumber from 0 to 15 (16th notes).
   */
  scheduleSound(beatNumber, noteTime) {
    if (this.uiData.sampleName == BEEP_LOW
        || this.uiData.sampleName == BEEP_HIGH) {
      let freq;
      if (beatNumber % 16 === 0) {  // beat 0 = high pitch
        freq = 880.0;
      } else if (beatNumber % 4 === 0) {  // quarter notes = medium pitch
        freq = 440.0;
      } else {  // other 16th notes = low pitch
        freq = 220.0;
      }
      if (this.uiData.sampleName == BEEP_HIGH) {
        freq *= 2;
      }
      let osc = this.audioContext.createOscillator();
      osc.connect(this.uiData.gainNode);
      osc.frequency.value = freq;
      osc.start(noteTime);
      osc.stop(noteTime + BEEP_DURATION);
    } else {
      if (!(this.uiData.sampleName in this.buffers)) {
        utils.warn('sample not in sample map: $', this.uiData.sampleName);
        return;
      }
      let node = this.audioContext.createBufferSource();
      node.buffer = this.buffers[this.uiData.sampleName];
      node.connect(this.uiData.gainNode);
      node.start(noteTime);
    }
  }

  /**
   * In HTML we use v-model.number with a v-on:change reference to this method,
   * so that the value can be stored in local storage.
   */
  updatedGainLevel() {
    this.storage.store(
        GAIN_LEVEL_STORAGE_KEY,
        Math.max(this.uiData.gainNode.gain.value, GAIN_LEVEL_MAX_VALUE));
  }

  maybeLoadSample() {
    if (this.uiData.sampleName == BEEP_LOW
        || this.uiData.sampleName == BEEP_LOW) {
      return;
    }
    // Only load new sample if it hasn't been loaded before.
    if (!(this.uiData.sampleName in this.buffers)) {
      utils.log('Loading sample: $', this.uiData.sampleName);
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
            alert('Failed to decode sound file :( ' + url);
            return;
          }
          loader.buffers[sampleName] = buffer;
          if (++loader.loadCount == loader.sampleNames.length)
            loader.onload(loader.buffers);
        },
        function(error) {
          console.error('Failed to decode sound file :(', error);
        }
      );
    }
    request.onerror = function() {
      alert('Failed to load sound files :(');
    }

    request.send();
  }
}

export {Audio};
