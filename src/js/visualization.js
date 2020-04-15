class Viz {
  constructor(window, document, audio) {
    this.audioContext = audio.getAudioContext();
    this.window = window;
    this.document = document;
    this.canvas;
    this.canvasContext;

    // The last 'box' we drew on the screen
    this.last16thNoteDrawn = -1;

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
    this.canvas = this.document.createElement('canvas');
    this.canvasContext = this.canvas.getContext('2d');
    this.canvas.width = this.window.innerWidth;
    this.canvas.height = this.window.innerHeight;
    this.canvasContext.strokeStyle = '#ffffff';
    this.canvasContext.lineWidth = 2;

    /*
    var container = this.document.createElement('div');
    container.className = 'container';
    container.appendChild(this.canvas);

    this.document.body.appendChild(container);
    */

    this.window.onorientationchange = () => { this.resetCanvas(); };
    this.window.onresize = () => { this.resetCanvas(); };

    // Starts the drawing loop.
    this.window.requestAnimFrame(() => {this.draw()});
  }

  draw() {
    var currentNote = this.last16thNoteDrawn;
    var currentTime = this.audioContext.currentTime;

    while (this.notesInQueue.length &&
           this.notesInQueue[0].time < currentTime) {
      currentNote = this.notesInQueue[0].note;
      this.notesInQueue.splice(0, 1);  // remove note from queue
    }

    // We only need to draw if the note has moved.
    if (this.last16thNoteDrawn != currentNote) {
      var x = Math.floor(this.canvas.width / 18);
      this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (var i = 0; i < 16; i++) {
        this.canvasContext.fillStyle = (currentNote == i) ?
            ((currentNote % 4 === 0) ? 'red' : 'blue') :
            'black';
        this.canvasContext.fillRect(x * (i + 1), x, x / 2, x / 2);
      }
      this.last16thNoteDrawn = currentNote;
    }

    // Set up to draw again
    this.window.requestAnimFrame(() => {this.draw()});
  }

  resetCanvas() {
    // Resize canvas. This will also clears the canvas.
    this.canvas.width = this.window.innerWidth;
    this.canvas.height = this.window.innerHeight;

    // Scroll to the top left.
    this.window.scrollTo(0, 0);
  }
}

export {Viz};