class Viz {
  constructor(window, document, audio) {
    this.audioContext = audio.getAudioContext();
    this.window = window;
    this.document = document;

    this.canvas;
    this.ctx;

    this.animationLoopId = -1;

    this.positions = [];

    // The last 'box' we drew on the screen
    this.lastNoteDrawn = 0;

    // Notes that have been put into the web audio, and may or may not have
    // played yet. {note, time}
    this.notesInQueue = [];
  }

  /**
   * Appends note in the queue for visualization.
   * @param noteAndTime An object with `note` and `time` props.
   */
  appendNote(noteAndTime) {
    this.notesInQueue.push(noteAndTime);
  }

  initCanvas() {
    // TODO(#27): For some reason we still need this setTimeout() here, though
    // the whole thing is already within a window.on('load', {}) listener.
    this.window.setTimeout(() => {
      console.log('initing canvas');

      this.canvas = this.document.getElementById('viz');
      this.resetCanvas();
      // this.canvas = this.document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2;

      this.window.onorientationchange = () => { this.resetCanvas(); };
      this.window.onresize = () => { this.resetCanvas(); };

      this.calcSizeAndPosition();

      this.draw(onload=true);
    }, 500);
  }

  /** Draws the visualization on screen.
   * @param {bool} onload - If true, draw only once on page load.
   */
  draw(onload=false) {
    // Compare note time with current audioContext time for exact timing.
    var currentTime = this.audioContext.currentTime;
    var currentNote = this.lastNoteDrawn;

    while (this.notesInQueue.length &&
           this.notesInQueue[0].time <= currentTime) {
      currentNote = this.notesInQueue[0].note;
      this.notesInQueue.splice(0, 1);  // remove note from queue
    }

    // We only need to draw if the note has moved.
    if (onload || currentNote != this.lastNoteDrawn) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      let x = Math.floor(this.canvas.width / 18);
      let width = x / 2;
      let height = x / 2;
      for (var i = 0; i < 4; i++) {
        let p = this.positions[i];
        if (i == currentNote) {
          this.ctx.fillStyle = this.getColor(i);
          this.ctx.fillRect(p.x, p.y, p.width, p.height);
        } else {
          this.ctx.strokeStyle = this.getColor(i);
          this.ctx.strokeRect(p.x, p.y, p.width, p.height);
        }
      }
      this.lastNoteDrawn = currentNote;
    }

    // Set up to draw again
    if (!onload) {
      this.animationLoopId = this.window.requestAnimationFrame(() => { this.draw(); });
    }
  }

  getColor(noteNumber) {
    if (noteNumber == 0) {
      return '#E74C3C';
    }
    return '#95A5A6';
  }

  calcSizeAndPosition() {
    this.positions = [];
    let paddingRatio = 0.15;  // 15% of width for padding on each side.
    let boxSizeRatio = 0.1;  // 10% of width.
    let padding = this.canvas.width * 0.15;
    let boxSize = Math.min(this.canvas.width * boxSizeRatio, 0.8 * this.canvas.height);
    let paddingY = (this.canvas.height - boxSize) / 2;
    let boxes = 4;
    let spacing = Math.floor((this.canvas.width - padding * 2 - boxSize * 4) / (boxes - 1));
    for (let i = 0; i < boxes; i++) {
      this.positions.push({
        x: Math.floor(padding + (boxSize + spacing) * i),
        y: Math.floor(paddingY),
        width: Math.floor(boxSize),
        height: Math.floor(boxSize)
      });
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
      this.draw(onload=true);
    }
  }
}

export {Viz};