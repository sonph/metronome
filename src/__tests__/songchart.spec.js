import * as clazz from '../js/songchart.js';

const TEST_JSON = {
  "sections": [
    {
      "name": "Section1",
      "length": 4
    },
    {
      "name": "Section2",
      "length": 8
    }
  ]
}

function loop(times, func) {
  for (let i = 0; i < times; i++) {
    func();
  }
}

describe(`Songchart.js tests`, () => {
  test(`Songchart init`, () => {
    let s = new clazz.SongChart(TEST_JSON);
    expect(s.getUiData().curSectionName).toEqual("Section1");
    expect(s.getUiData().curSectionLength).toEqual(4);
  });

  test(`SongChart tick to next beat`, () => {
    let s = new clazz.SongChart(TEST_JSON);
    expect(s.getUiData().curBeat).toEqual(1);
    loop(4, () => { s.tick(); });
    expect(s.getUiData().curBeat).toEqual(2);
  });

  test(`SongChart tick to next measure`, () => {
    let s = new clazz.SongChart(TEST_JSON);
    expect(s.getUiData().curBeat).toEqual(1);
    expect(s.getUiData().curMeasure).toEqual(1);
    loop(4 * 4, () => { s.tick(); });
    expect(s.getUiData().curBeat).toEqual(1);
    expect(s.getUiData().curMeasure).toEqual(2);
  });

  test(`SongChart tick to next section`, () => {
    let s = new clazz.SongChart(TEST_JSON);
    loop(4 * 4 * 4, () => { s.tick(); });
    expect(s.getUiData().curSectionName).toEqual("Section2");
    expect(s.getUiData().curSectionLength).toEqual(8);
  });

  test(`SongChart tick returns false on song end`, () => {
    let s = new clazz.SongChart(TEST_JSON);
    loop(4 * 4 * (4 + 8) - 1, () => { s.tick(); });
    // Last call.
    expect(s.tick()).toEqual(false);
    // Reset.
    expect(s.getUiData().curSectionName).toEqual("Section1");
    expect(s.getUiData().curSectionLength).toEqual(4);
    expect(s.getUiData().curBeat).toEqual(1);
    expect(s.getUiData().curMeasure).toEqual(1);
  });
});
