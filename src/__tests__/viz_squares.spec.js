import { fireEvent, within, waitFor } from '@testing-library/dom';

import Squares from '../js/viz_squares.js';

const CANVAS = document.createElement('canvas')

function createCanvas() {
  document.body.appendChild(CANVAS);
}

// TODO(sonph): Probably best to use some sort of screenshot-based diff test.
describe(`viz_squares.js tests`, () => {
  test(`Number of beats`, async () => {
    within(createCanvas());

    let c = new Squares(CANVAS, { numBeats: 8 });

    c.draw();
  });
});
