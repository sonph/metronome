import Storage from './storage.js';

export default class App {
  constructor(window) {
    this.window = window;
    this.storage = new Storage(window);

    this.uiData = {
      settings: {
        visible: false,
        flashRedOnFirstBeat: true,
        hidePastSections: true
      }
    };
  }

  showSettings() {
    this.uiData.settings.visible = true;
  }

  hideSettings() {
    this.uiData.settings.visible = false;
  }

  getUiData() {
    return this.uiData;
  }
}