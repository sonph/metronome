import * as u from './utils.js';

export default class Circles {
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
      this.ctx.beginPath();
      if (i == noteNumber) {
        this.ctx.fillStyle = this.getColor(i);
        this.ctx.arc(
          p.centerX,
          p.centerY,
          p.radius,
          /* startAngle= */ 0,
          /* endAngle= */ Math.PI * 2,  // radians
          /* antiClockwise= */ false);
        this.ctx.fill();
      } else {
        this.ctx.strokeStyle = this.getColor(i);
        this.ctx.arc(
          p.centerX,
          p.centerY,
          p.radius,
          /* startAngle= */ 0,
          /* endAngle= */ Math.PI * 2,  // radians
          /* antiClockwise= */ false);
        this.ctx.stroke();
      }
    }
  }

  /* Called when window is updated such as resized. */
  resetCanvas() {
    this.positions = this.calcSizeAndPosition();
  }

  calcSizeAndPosition() {
    let positions = [];
    let paddingRatio = 0.15;  // 15% of width for padding on each side.
    let diameterRatio = 0.1;  // 10% of width.
    let padding = this.canvas.width * 0.15;
    let diameter = Math.min(this.canvas.width * diameterRatio, 0.8 * this.canvas.height);
    let paddingY = (this.canvas.height - diameter) / 2;
    let spacing = Math.floor((this.canvas.width - padding * 2 - diameter * 4) / (this.numBeats - 1));
    let radius = diameter / 2;
    for (let i = 0; i < this.numBeats; i++) {
      positions.push({
        centerX: Math.floor(padding + (diameter + spacing) * i + radius),
        centerY: Math.floor(paddingY + radius),
        radius: Math.floor(radius),
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
