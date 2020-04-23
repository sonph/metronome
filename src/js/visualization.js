import * as utils from './utils.js';
import Squares from './viz_squares.js';
import Circles from './viz_circles.js';

const SQUARES = 'squares';
const CIRCLES = 'circles';
const STYLES = [SQUARES, CIRCLES];

class Viz {
  constructor(window, document, audio) {
    this.audio = audio;
    this.audioContext = audio.getAudioContext();
    this.window = window;
    this.document = document;

    this.canvas;

    this.animationLoopId = -1;

    // The last 'box' we drew on the screen
    this.lastNoteDrawn = {note: -1, time: 0};

    // Notes that have been put into the web audio, and may or may not have
    // played yet. {note, time}
    this.notesInQueue = [];

    this.uiData = {
      style: CIRCLES,
      styles: STYLES,
    }
  }

  /** Appends note in the queue for visualization. */
  appendNote(note, time) {
    this.notesInQueue.push({note: note, time: time});
  }

  initCanvas() {
    // TODO(#27): For some reason we still need this setTimeout() here, though
    // the whole thing is already within a window.on('load', {}) listener.
    this.window.setTimeout(() => {
      console.log('initing canvas');

      this.canvas = this.document.getElementById('viz');
      this.resetCanvas();

      this.setStyle(this.uiData.style);

      this.window.onorientationchange = () => { this.resetCanvas(); };
      this.window.onresize = () => { this.resetCanvas(); };

      this.draw(onload=true);
    }, 500);
  }

  /** Draws the visualization on screen.
   * @param {bool} onload - If true, draw only once on page load.
   */
  draw(onload=false) {
    // Compare note time with current audioContext time for exact timing.
    let currentTime = this.audioContext.currentTime;
    var currentNote = this.lastNoteDrawn;

    while (this.notesInQueue.length &&
           this.notesInQueue[0].time <= currentTime) {
      currentNote = this.notesInQueue[0];
      this.notesInQueue.splice(0, 1);  // remove note from queue
    }

    // We only need to draw if the note has moved.
    if (onload || currentNote != this.lastNoteDrawn) {
      utils.log(
          '[viz] currentTime: $, note: $, noteTime: $ ($)',
          currentTime, currentNote.note, currentNote.time.toFixed(6),
          (currentNote.time - currentTime).toFixed(6));
      this.painter.draw(Math.floor(currentNote.note / 4));
      this.lastNoteDrawn = currentNote;
    }

    // Set up to draw again
    if (!onload) {
      this.animationLoopId = this.window.requestAnimationFrame(() => { this.draw(); });
    }
  }

  resetCanvas() {
    // Resize canvas. This will also clears the canvas.
    let d = this.document.getElementById('viz-container');
    // TODO(#27): Without setTimeout() method in resetCanvas(),
    // clientWidth for some reason will be 0, though this whole thing is already
    // within window.on('load', {}) event.
    this.canvas.width = d.clientWidth;
    this.canvas.height = d.clientHeight;
  }

  startDrawing() {
    this.animationLoopId = this.window.requestAnimationFrame(() => { this.draw(); });
  }

  stopDrawing() {
    if (this.animationLoopId != -1) {
      this.window.cancelAnimationFrame(this.animationLoopId);
      this.animationLoopId = -1;
      this.lastNoteDrawn = {note: -1, time: 0};
      this.draw(onload=true);
    }
  }

  setStyle(style) {
    this.uiData.style = style;
    if (style === SQUARES) {
      this.painter = new Squares(this.canvas, {});
    } else if (style === CIRCLES) {
      this.painter = new Circles(this.canvas);
    } else {
      console.warn('Unexpected visualization style: ' + style);
    }
  }
}

export {Viz};