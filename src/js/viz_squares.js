import * as u from './utils.js';

export default class Squares {
  constructor(canvas, options={}) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineWidth = 2;
    this.updateNumBeats(options.numBeats || 4);
  }

  /* noteNumber must be between 0 and numBeats - 1. */
  draw(noteNumber) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.numBeats; i++) {
      let p = this.positions[i];
      if (i == noteNumber) {
        this.ctx.fillStyle = this.getColor(i);
        this.ctx.fillRect(p.x, p.y, p.width, p.height);
      } else {
        this.ctx.strokeStyle = this.getColor(i);
        this.ctx.strokeRect(p.x, p.y, p.width, p.height);
      }
    }
  }

  calcSizeAndPosition() {
    let positions = [];
    let paddingRatio = 0.15;  // 15% of width for padding on each side.
    let boxSizeRatio = 0.1;  // 10% of width.
    let padding = this.canvas.width * 0.15;
    let boxSize = Math.min(this.canvas.width * boxSizeRatio, 0.8 * this.canvas.height);
    let paddingY = (this.canvas.height - boxSize) / 2;
    let spacing = Math.floor((this.canvas.width - padding * 2 - boxSize * 4) / (this.numBeats - 1));
    for (let i = 0; i < this.numBeats; i++) {
      positions.push({
        x: Math.floor(padding + (boxSize + spacing) * i),
        y: Math.floor(paddingY),
        width: Math.floor(boxSize),
        height: Math.floor(boxSize)
      });
    }
    return positions;
  }

  getColor(noteNumber) {
    return u.sprintf(
        'rgb($, $, $)',
        50, 150, Math.floor(255 - (255 / this.numBeats) * noteNumber));
  }

  /** Change how many beats per measure. */
  updateNumBeats(beats) {
    this.numBeats = beats;
    this.positions = this.calcSizeAndPosition();
  }
}
