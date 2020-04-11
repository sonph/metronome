/** @const {number} */
var QUARTER_NOTE = 0;
/** @const {number} */
var EIGHTH_NOTE = 1;
/** @const {number} */
var SIXTEENTH_NOTE = 2;

/** Metronome class for handling scheduling and current beat. */
class Metronome {
  constructor(audio, viz) {
    /** @type {boolean} */
    this.isPlaying = false;
    /** @type {!audio.Audio} */
    this.audio = audio;
    this.audioContext = this.audio.getAudioContext();

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

    // tempo (in beats per minute)
    this.tempo = 120.0;

    this.noteResolution = QUARTER_NOTE;

    // Length of 'beep' (in seconds)
    this.noteLength = 0.05;

    // The start time of the entire sequence.
    this.startTime;
  }

  setTempo(tempo) {
    this.tempo = tempo;
  }

  setNoteResolution(index) {
    this.noteResolution = index;
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
    var secondsPerBeat = 60.0 / this.tempo;
    // Add beat length to last beat time
    this.nextNoteTime += 0.25 * secondsPerBeat;
    // Advance the beat number, wrapping to zero
    this.current16thNote = (this.current16thNote + 1) % 16;
  }

  scheduleNote(beatNumber, time) {
    // Append note in queue for visualization.
    this.viz.appendNote({note: beatNumber, time: time});

    if ((this.noteResolution == EIGHTH_NOTE) && (beatNumber % 2))
      return;  // we're not playing non-8th 16th notes
    if ((this.noteResolution == QUARTER_NOTE) && (beatNumber % 4))
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

  /** Starts the metronome. */
  play() {
    console.log('[metronomeclass.js] play()');
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.current16thNote = 0;
      this.nextNoteTime = this.audioContext.currentTime;
      this.timerWorker.postMessage('START');
      return 'STOP';
    } else {
      this.timerWorker.postMessage('STOP');
      // TODO(sonph): remove this return and relies on isPlaying() attribute in
      // UI instead.
      return 'PLAY';
    }
  }
}

export {Metronome};
