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
      "subsections": [
        {
          "subname": "Piano",
          "sublength": 2,
        },
        {
          "subname": "Fill",
          "sublength": 2,
        }
      ]
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

      countIn: {
        lengthMeasures: 0,
        curCountInMeasure: 1
      },

      // Current beat of the measure. 1 to BEATS (4).
      curBeat: 1,
      // Current measure of the section. 1 to `measures` in json.
      curMeasure: 1,
      // Current section name and length in measures.
      curSectionName: '',
      curSectionLength: 0,
      curSectionIndex: 0,
      sections: this.json.sections,
      // Current subsection index, or -1 if there is no subsection.
      curSubSectionIndex: -1,
      curSubSectionMeasure: -1,

      // Current total running measures.
      curRunningMeasures: 1
    };

    this.startingSection = 0;

    // Current tick of the beat. 0 to 3 (16th notes).
    this.curTick = 0;

    // Update uiData based on JSON data, e.g. section name and length.
    this.reset();
  }

  reset() {
    this.uiData.countIn.curCountInMeasure = 1;

    this.curTick = 0;
    this.uiData.curBeat = 1;
    this.setStartingFromSection(this.startingSection);
  }

  /** Sets how many measures to count in. */
  setCountInMeasures(measures) {
    this.uiData.countIn.lengthMeasures = measures;
  }

  /**
   * Sets the current selected section to play from.
   * @param {int} index - Selected section index.
   * @returns The number of measures before this section, plus 1 (first measure
   *     of this section).
   */
  setStartingFromSection(index) {
    utils.checkState(
        index < this.json.sections.length,
        'Selected index: $ while there are only $ sections',
                      index, this.json.sections.length);
    this.startingSection = index;
    this.uiData.curSectionIndex = index;
    this.uiData.curMeasure = 1;
    let section = this.getCurrentSection();
    this.uiData.curSectionName = section.name;
    this.uiData.curSectionLength = section.length;
    let subsections = this.getCurrentSubSections();
    if (subsections.length) {
      this.uiData.curSubSectionIndex = 0;
      this.uiData.curSubSectionMeasure = 1;
    } else {
      this.uiData.curSubSectionIndex = -1;
      this.uiData.curSubSectionMeasure = -1;
    }
    let s = 0;
    for (let i = 0; i < index; i++) {
      s += this.json.sections[i].length * BEATS;
    }
    this.uiData.curRunningMeasures = s + 1;  // +1 because it starts from 1.
  }

  getCurrentSection() {
    return this.json.sections[this.uiData.curSectionIndex];
  }

  /** Returns list of subsections corresponding to the current section, or empty
   * list if the property does not exist.
   */
  getCurrentSubSections() {
    let currentSection = this.getCurrentSection();
    if (currentSection.hasOwnProperty('subsections')) {
      return currentSection.subsections;
    }
    return [];
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
    let countIn = this.uiData.countIn;
    if (countIn.curCountInMeasure <= countIn.lengthMeasures) {
      countIn.curCountInMeasure += 1;
      // Don't go to the next measure in this call just yet.
      return true;
    }
    this.uiData.curRunningMeasures += 1;
    this.uiData.curMeasure += 1;
    let section = this.getCurrentSection();
    if (this.uiData.curMeasure > section.length) {
      this.uiData.curMeasure = 1;
      return this.nextSection();
    } else {
      // Next measure of sub sections within this section.
      this.nextSubSectionMeasure(/* newSection= */ false);
      return true;
    }
  }

  /**
   * Check and increment sub section measures.
   * @param newSection If true, this next subsection is of the next section.
   *     If false, this next subsection is of the same section.
   */
  nextSubSectionMeasure(newSection) {
    if (newSection) {
      let section = this.getCurrentSection();
      if (section.hasOwnProperty('subsections')) {
        // First measure of the first subsection.
        this.uiData.curSubSectionIndex = 0;
        this.uiData.curSubSectionMeasure = 1;
      } else {
        this.uiData.curSubSectionIndex = -1;
        this.uiData.curSubSectionMeasure = -1;
      }
    } else {
      if (this.uiData.curSubSectionIndex != -1) {
        this.uiData.curSubSectionMeasure += 1;
        let currentSection = this.getCurrentSection();
        utils.checkState(
            currentSection.hasOwnProperty('subsections'),
            '[songchart.js] Current section (index: '
            + this.uiData.curSectionIndex + ') does not have subsections, yet '
            + 'incrementing to next subsection');
        let currentSubSection =
            currentSection.subsections[this.uiData.curSubSectionIndex];
        // Measure count starts from 1.
        if (this.uiData.curSubSectionMeasure > currentSubSection.sublength) {
          // Next subsection.
          this.uiData.curSubSectionIndex += 1;
          utils.checkState(
            this.uiData.curSubSectionIndex
                < currentSection.subsections.length,
            '[songchart.js] Incrementing to next subsection index out of '
            + ' bound: ' + this.uiData.curSectionIndex + ', subsection index: '
            + this.uiData.curSubSectionIndex);
          this.uiData.curSubSectionMeasure = 1;
        }
      }
    }
  }

  /** Update next section. Returns false if the end has been reached. */
  nextSection() {
    this.uiData.curSectionIndex += 1;
    if (this.uiData.curSectionIndex >= this.json.sections.length) {
      this.reset();
      return false;
    }
    let section = this.getCurrentSection();
    this.uiData.curSectionName = section.name;
    this.uiData.curSectionLength = section.length;
    this.nextSubSectionMeasure(/* newSection= */ true);
    return true;
  }

  getUiData() {
    return this.uiData;
  }

  appendSection() {
    this.json.sections.push({
        "name": "Untitled",
        "length": 8,
    });
  }

  /**
   * Sum of sub sections lengths must match section's total length. 
   * @returns List of section indices that violate this condition, or an empty
   *     list.
   */
  validateSubSectionsLength() {
    let indices = [];
    for (let i = 0; i < this.json.sections.length; i++) {
      let section = this.json.sections[i];
      let sum = 0;
      if (!section.hasOwnProperty('subsections')) {
        continue;
      }
      for (let j = 0; j < section.subsections.length; j++) {
        sum += section.subsections[j].length;
      }
      if (sum != section.length) {
        indices.push(i);
      }
    }
    return indices;
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