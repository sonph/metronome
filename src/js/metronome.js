import * as utils from './utils.js'

/** @const {number} */
const QUARTER_NOTE = 0;
/** @const {number} */
const EIGHTH_NOTE = 1;
/** @const {number} */
const SIXTEENTH_NOTE = 2;

/** Metronome class for handling scheduling and current beat. */
class Metronome {
  constructor(audio, viz) {
    /** @type {boolean} */
    this.isPlaying = false;
    /** @type {!audio.Audio} */
    this.audio = audio;
    this.audioContext = this.audio.getAudioContext();
    this.audioContext.resume();

    this.viz = viz;

    this.timerWorker = this.createTimerWorker();
    // How frequently to call scheduling function in milli.
    this.lookaheadMsec = 25.0;
    // When the next note is due.
    this.nextNoteTime = 0.0;
    // How far ahead to schedule audio (sec). This is calculated from lookahead,
    // and overlaps with next interval (in case the timer is late)
    this.scheduleAheadTime = 0.1;

    // What note is currently last scheduled?
    this.current16thNote;

    // Length of 'beep' (in seconds)
    this.noteLength = 0.05;

    // The start time of the entire sequence.
    this.startTime;

    this.songChart;
    // At the beginning the song chart already starts at the first beat. However
    // the metronome audio has yet to schedule the first note. So don't tick the
    // the songchart on the first note.
    this.songChartSkippedFirstNote = false;

    this.uiData = {
      currentBeat: 0,
      toggleLabel: 'START',
      tempo: 120,
      noteResolution: QUARTER_NOTE
    };
  }

  createTimerWorker() {
    var w = new Worker('src/js/metronomeworker.js');
    w.onmessage = e => {
      if (e.data == 'TICK') {
        // console.log('tick!');
        this.scheduler();
      } else {
        console.log('message: ' + e.data);
      }
    };
    w.postMessage({'interval': this.lookaheadMsec});
    return w;
  }

  nextNote() {
    // Advance current note and time by a 16th note...
    // Notice this picks up the CURRENT tempo value to calculate beat length.
    var secondsPerBeat = 60.0 / this.uiData.tempo;
    // Add beat length to last beat time
    this.nextNoteTime += 0.25 * secondsPerBeat;
    // Advance the beat number, wrapping to zero
    this.current16thNote = (this.current16thNote + 1) % 16;
    if (this.current16thNote == 0) {
      this.uiData.currentBeat += 1;
    }

    if (this.songChartSkippedFirstNote) {
      if (!this.songChart.tick()) {
        console.log('[metronome.js] Stopping at end of song.');
        this.stop();
      }
    } else {
      this.songChartSkippedFirstNote = true;
    }
  }

  scheduleNote(beatNumber, time) {
    // Append note in queue for visualization.
    this.viz.appendNote({note: beatNumber, time: time});

    if ((this.uiData.noteResolution == EIGHTH_NOTE) && (beatNumber % 2))
      return;  // we're not playing non-8th 16th notes
    if ((this.uiData.noteResolution == QUARTER_NOTE) && (beatNumber % 4))
      return;  // we're not playing non-quarter 8th notes

    var freq;
    if (beatNumber % 16 === 0) {  // beat 0 == high pitch
      freq = 880.0;
    } else if (beatNumber % 4 === 0) {  // quarter notes = medium pitch
      freq = 440.0;
    } else {  // other 16th notes = low pitch
      freq = 220.0;
    }
    this.audio.beep(freq, time, time + this.noteLength);
  }

  scheduler() {
    // while there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (this.nextNoteTime <
           (this.audioContext.currentTime + this.scheduleAheadTime)) {
      this.scheduleNote(this.current16thNote, this.nextNoteTime);
      this.nextNote();
    }
  }

  toggle() {
    if (!this.isPlaying) {
      this.start();
    } else {
      this.stop();
    }
  }

  /** Starts the metronome. */
  start() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.current16thNote = 0;
      this.uiData.currentBeat = 0;
      this.uiData.toggleLabel = 'STOP';
      this.nextNoteTime = this.audioContext.currentTime;
      this.timerWorker.postMessage('START');
    }
  }

  /** Stops the metronome and resets. For now assumes reset from the beginning. */
  stop() {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.current16thNote = 0;
      this.timerWorker.postMessage('STOP');
      this.uiData.toggleLabel = 'START';
      this.songChartSkippedFirstNote = false;
      this.songChart.reset();
    }
  }

  setSongChart(songChart) {
    utils.checkIsDefined('songChart', songChart);
    this.songChart = songChart;
  }

  getUiData() {
    return this.uiData;
  }

  setTempo(tempo) {
    this.uiData.tempo = tempo;
  }

  tempoHalve() { this.uiData.tempo /= 2; }
  tempoDecrementBy10() { this.uiData.tempo -= 10; }
  tempoDecrementBy5() { this.uiData.tempo -= 5; }
  tempoDecrement() { this.uiData.tempo -= 1; }
  tempoIncrement() { this.uiData.tempo += 1; }
  tempoIncrementBy5() { this.uiData.tempo += 5; }
  tempoIncrementBy10() { this.uiData.tempo += 10; }
  tempoDouble() { this.uiData.tempo *= 2; }
}

export {Metronome};
