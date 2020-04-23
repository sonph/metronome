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
    /** @type {!audio.Audio} */
    this.audio = audio;
    this.audioContext = this.audio.getAudioContext();

    this.viz = viz;

    this.timerWorker = this.createTimerWorker();
    // When the next note is due.
    this.nextNoteTime = 0.0;
    // How far ahead to schedule audio (sec). This is calculated from lookahead,
    // and overlaps with next interval (in case the timer is late)
    this.scheduleAheadTime = 0.1;

    // Note that was last scheduled. Do not rely on this for UI since it won't
    // be in sync.
    this.current16thNote;

    this.songChart;
    // When paused the song chart already starts at the first beat. However
    // the metronome audio has yet to schedule the first beat. So don't tick the
    // songchart on the first beat.
    this.songChartSkippedFirstNote = false;

    this.uiData = {
      isPlaying: false,
      toggleLabel: 'START',
      tempo: 135,
      noteResolution: QUARTER_NOTE
    };

    // Store note time's plus audio latency. These are used to determine *when*
    // to make calls that propagate to Vue models, so that data models changes
    // are sync'ed with audio and visuals.
    // This acts as a queue, so that each note will make sure to 'tick' the song
    // chart by one beat. In case things are delayed, the song chart will be
    // tick'ed once for each note queued up.
    this.audioDelayedNoteTimes = [];

    // Accumulate current audioContext time for calculating tempo.
    this.tapTempoPoints = [];
    // Last audioContext time that the user tapped. Used to reset the points.
    this.lastTapTime = -1;
  }

  createTimerWorker() {
    let w = new Worker('src/js/metronomeworker.js');
    w.onmessage = e => {
      if (e.data == 'TICK') {
        this.scheduler();
      }
    };
    return w;
  }

  nextNote() {
    // Advance current note and time by a 16th note...
    // Notice this picks up the CURRENT tempo value to calculate beat length.
    let secondsPerBeat = 60.0 / this.uiData.tempo;
    // Add beat length to last beat time
    this.nextNoteTime += 0.25 * secondsPerBeat;
    // Advance the beat number, wrapping to zero
    this.current16thNote = (this.current16thNote + 1) % 16;
  }

  scheduleNote(beatNumber, noteTime) {
    if ((this.uiData.noteResolution == EIGHTH_NOTE) && (beatNumber % 2))
      return;  // we're not playing non-8th 16th notes
    if ((this.uiData.noteResolution == QUARTER_NOTE) && (beatNumber % 4))
      return;  // we're not playing non-quarter 8th notes

    // beatNumber is 0 - 15, while we only need 0 - 3 for visualization purpose.
    if (beatNumber % 4 == 0) {
      // Append note in queue for visualization.
      // Some mobile browsers may have a problem with audio lagging, where
      // baseLatency is as much as 0.09 seconds. This causes visualization to run
      // ahead of the audible sounds.
      // To fix this, we draw late compare to the actual note time, depending on
      // how much the baseLatency lag is.
      this.viz.appendNote(beatNumber, noteTime + this.audio.getBaseLatency());
    }
    this.audio.scheduleSound(beatNumber, noteTime);

    // Don't advance the song chart here yet. Store the note time and wait until
    // the next note time is near to update.
    this.audioDelayedNoteTimes.push(noteTime + this.audio.getBaseLatency());
  }

  maybeTickSongChart() {
    if (this.songChart.getUiData().enabled) {
      let currentTime = this.audioContext.currentTime;
      while(this.audioDelayedNoteTimes.length
          && this.audioDelayedNoteTimes[0] <= currentTime) {
        let noteTime = this.audioDelayedNoteTimes[0];
        utils.log(
            '[songchart] currentTime: $, noteTime: $ ($)',
            currentTime.toFixed(6), noteTime.toFixed(6),
            (noteTime - currentTime).toFixed(6));
        // Remove note.
        this.audioDelayedNoteTimes.splice(0, 1);
        if (!this.songChartSkippedFirstNote) {
          this.songChartSkippedFirstNote = true;
          return;
        }
        if (!this.songChart.nextBeat()) {
          console.log('Stopping at end of song.');
          this.stop();
          return;
        }
      }
    }
  }

  /**
   * Calculate note times and schedule notes for audio and visualization.
   *
   * Called once per metronome worker tick.
   */
  scheduler() {
    this.maybeTickSongChart();

    // When nextNoteTime (in the future) is near (gap is determined by 
    // scheduleAheadTime), schedule audio & visuals and advance to the next
    // note.
    while (this.nextNoteTime <
           (this.audioContext.currentTime + this.scheduleAheadTime)) {
      this.scheduleNote(this.current16thNote, this.nextNoteTime);
      this.nextNote();
    }
  }

  toggle() {
    if (!this.uiData.isPlaying) {
      this.start();
    } else {
      this.stop();
    }
  }

  /** Starts the metronome. */
  start(delayMs = 0.5) {
    if (!this.uiData.isPlaying) {
      // Must resume audio context after a user gesture on the page.
      // https://goo.gl/7K7W
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      this.audio.unlockAudio();
      this.current16thNote = 0;
      this.uiData.isPlaying = true;
      this.uiData.toggleLabel = 'STOP';
      // Set first note to be 0.5s from now (when user clicks).
      this.nextNoteTime = this.audioContext.currentTime + delayMs;
      this.timerWorker.postMessage('START');
      this.viz.startDrawing();
    }
  }

  /** Stops the metronome and resets. For now assumes reset from the beginning. */
  stop() {
    if (this.uiData.isPlaying) {
      this.uiData.isPlaying = false;
      this.current16thNote = 0;
      this.timerWorker.postMessage('STOP');
      this.uiData.toggleLabel = 'START';
      this.songChartSkippedFirstNote = false;
      this.songChart.reset();
      this.viz.stopDrawing();
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

  tapTempo() {
    // Since we create audioContext on page load, it's in suspended state.
    // Without this resume() call, `.currentTime` maybe 0.
    this.audioContext.resume();
    let t = this.audioContext.currentTime;
    if (this.lastTapTime == -1 || (t - this.lastTapTime) >= 5) {
      // Remove all taps older than 5 secs.
      this.tapTempoPoints = [t];
      this.lastTapTime = t;
      // Return on first tap.
      return;
    }
    this.tapTempoPoints.push(t);
    if (this.tapTempoPoints.length <= 1) {
      console.warn(utils.sprintf(
          "[metronome.js] Tap tempo got $ points, expected at least 2.",
          this.tapTempoPoints.length));
      return;
    }
    this.lastTapTime = t;
    // Calculate average interval from maximum last 4 points and set tempo.
    let sumIntervals = 0;
    let countIntervals = 0;
    let prevInterval = -1;
    let i = this.tapTempoPoints.length - 1;
    if (!utils.checkState(
         this.tapTempoPoints.length >= 2,
         "Expect more than 2 tempo points, got $ points",
         this.tapTempoPoints.length)) {
      return;
    }
    while(countIntervals <= 4 && i > 0) {
      let curInterval = this.tapTempoPoints[i] - this.tapTempoPoints[i - 1];
      if (prevInterval != -1
          && (curInterval >= 1.5 * prevInterval
              || curInterval <= 0.66 * prevInterval)) {
        // If the difference between the last interval (newer) vs this current
        // interval (older) is too much, that indicates a change in tempo. Don't
        // include the older ones.
        break;
      }
      sumIntervals += curInterval;
      countIntervals += 1;
      i--;
    }
    let avgInterval = sumIntervals / countIntervals;
    if (avgInterval <= 0) {
      console.warn("[metronome.js] Average interval = 0 "
                   + "(perhaps audioContext hasn't been resumed?)");
      return;
    }
    this.uiData.tempo = (60.0 / (sumIntervals / countIntervals)).toFixed(2);
    if (this.tapTempoPoints.length == 5 && !this.uiData.isPlaying) {
      // Starts on the 5th tap (next measure first beat)
      this.start(/* delayMs= */0);
    }
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
