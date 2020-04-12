import * as utils from './utils.js';

const NUT_JSON = {
  "name": "Nứt",
  "artist": "Ngọt",
  "tempo": "145",
  "time_signature": "4/4",
  "sections": [
    {
      "name": "Intro",
      "measures": 4,
    },
    {
      "name": "Verse",
      "measures": 4,
    },
    {
      "name": "Prechorus",
      "measures": 4,
    },
    {
      "name": "Chorus",
      "measures": 4,
    }
  ]
};

/** Class for handling song charting. */
class SongChart {
  constructor() {
    this.json = NUT_JSON;

    this.uiData = {};

    this.curSectionIndex;
    this.curSectionLengthTicks;
    this.curSectionMark;

    this.reset();
  }

  reset() {
    this.curSectionIndex = 0;
    this.curSectionLengthTicks =
        this.json.sections[0].measures * 4 /*beats*/ * 4 /*16th notes*/;
    this.curSectionMark = 0;
    this.updateSectionName();
  }

  updateSectionName() {
    this.uiData.currentSectionName = this.json.sections[this.curSectionIndex].name;
  }

  /** 
   * Returns false if the end has been reached.
   */
  tick() {
    this.curSectionMark += 1;
    if (this.curSectionMark >= this.curSectionLengthTicks) {
      return this.nextSection();
    }
    return true;
  }

  /**
   * Returns false if the end has been reached.
   */
  nextSection() {
    this.curSectionIndex++;
    if (this.curSectionIndex >= this.json.sections.length) {
      this.reset();
      return false;
    }
    this.curSectionLengthTicks =
        this.json.sections[this.curSectionIndex].measures * 4 * 4;
    this.curSectionMark = 0;
    this.updateSectionName();
    return true;
  }

  getUiData() {
    return this.uiData;
  }

  /**
   * Fetches song chart from given url.
   * @param {string} url Url.
  async fetchFromJson(url) {
    let response = await fetch(url);
    let song = await response.json();

    // wait 1 second
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));

    return song;
  }
  */
}

export { SongChart }