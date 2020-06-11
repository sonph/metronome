import { fireEvent, within, waitFor } from '@testing-library/dom';

import Circles from '../js/viz_circles.js';

const CANVAS = document.createElement('canvas')

function createCanvas() {
  document.body.appendChild(CANVAS);
}

// TODO(sonph): Probably best to use some sort of screenshot-based diff test.
describe(`viz_circles.js tests`, () => {
  test(`Number of beats`, async () => {
    within(createCanvas());

    let c = new Circles(CANVAS, { numBeats: 8 });

    c.draw();
  });
});
