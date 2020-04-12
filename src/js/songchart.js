import * as utils from './utils.js';

/** Class for handling song charting. */
class SongChart {
  constructor(json, sectionNameItem) {
    utils.checkIsDefined('#sectionName', sectionNameItem);
    this.json = json;
    this.sectionNameItem = sectionNameItem;

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
    this.sectionNameItem.innerText = this.json.sections[this.curSectionIndex].name;
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