import * as clazz from '../js/songchart.js';

const TEST_JSON = {
  "sections": [
    {
      "name": "Section1",
      "measures": 4
    },
    {
      "name": "Section2",
      "measures": 4
    }
  ]
}

describe(`Songchart.js tests`, () => {
  test(`Songchart init`, () => {
    let s = new clazz.SongChart(TEST_JSON);
    expect(s.getUiData().currentSectionName).toEqual("Section1");
  });

  test(`SongChart should progress to next section`, () => {
    let s = new clazz.SongChart(TEST_JSON);
    for (var i = 0; i < 4 * 16; i++) {
      s.tick();
    }
    expect(s.getUiData().currentSectionName).toEqual("Section2");
  });
});
