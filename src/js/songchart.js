import * as utils from './utils.js';

// How many beats in a measure.
const BEATS = 4

const NUT_JSON = {
  "name": "Nứt",
  "artist": "Ngọt",
  "tempo": "145",
  "time_signature": "4/4",
  "sections": [
    {
      "name": "Intro",
      "length": 4,
    },
    {
      "name": "Verse",
      "length": 4,
    },
    {
      "name": "Prechorus",
      "length": 4,
    },
    {
      "name": "Chorus",
      "length": 4,
    }
  ]
};

/** Class for handling song charting. */
class SongChart {
  constructor(json) {
    this.json = json || NUT_JSON;

    this.uiData = {
      name: this.json.name,
      artist: this.json.artist,
      // Current beat of the measure. 1 to BEATS (4).
      curBeat: 1,
      // Current measure of the section. 1 to `measures` in json.
      curMeasure: 1,
      // Current section name and length in measures.
      curSectionName: '',
      curSectionLength: 0
    };

    this.curSectionIndex = 0;
    // Current tick of the beat. 0 to 3 (16th notes).
    this.curTick = 0;

    // Update uiData based on JSON data, e.g. section name and length.
    this.reset();
  }

  reset() {
    this.curSectionIndex = 0;
    this.curTick = 0;
    this.uiData.curBeat = 1;
    this.uiData.curMeasure = 1;
    this.uiData.curSectionName = this.json.sections[this.curSectionIndex].name;
    this.uiData.curSectionLength = this.json.sections[this.curSectionIndex].length;
  }

  /** Returns false if the end has been reached. */
  tick() {
    this.curTick += 1;
    if (this.curTick >= 4) {
      this.curTick = 0;
      return this.nextBeat();
    }
    return true;
  }

  /** Update next beat. If it's the end of a measure, update the next measure. */
  nextBeat() {
    this.uiData.curBeat += 1;
    if (this.uiData.curBeat > BEATS) {
      this.uiData.curBeat = 1;
      return this.nextMeasure();
    }
    return true;
  }

  /** Update next measure. If it's the end of a section, update the next section. */
  nextMeasure() {
    this.uiData.curMeasure += 1;
    if (this.uiData.curMeasure > this.json.sections[this.curSectionIndex].length) {
      this.uiData.curMeasure = 1;
      return this.nextSection();
    }
    return true;
  }

  /** Update next section. Returns false if the end has been reached. */
  nextSection() {
    this.curSectionIndex += 1;
    if (this.curSectionIndex >= this.json.sections.length) {
      this.reset();
      return false;
    }
    this.uiData.curSectionName = this.json.sections[this.curSectionIndex].name;
    this.uiData.curSectionLength = this.json.sections[this.curSectionIndex].length;
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