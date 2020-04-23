import Storage from './storage.js';

export default class App {
  constructor(window) {
    this.window = window;
    this.storage = new Storage(window);

    this.uiData = {
      settings: {
        visible: false,
        flashRedOnFirstBeat: true,
        hidePastSections: true,
      },
      storage: {
        available: this.storage.isStorageAvailable(),
        pasteBinKey: this.storage.getPasteBinKey(),
        // Control the `saved!` text when saving api key from input.
        savedShown: false
      }
    };
  }

  showSettings() {
    this.uiData.settings.visible = true;
  }

  hideSettings() {
    this.uiData.settings.visible = false;
  }

  storePasteBinKey() {
    this.uiData.storage.savedShown = false;
    if (this.storage.isStorageAvailable()
        && this.storage.storePasteBinKey(this.uiData.storage.pasteBinKey)) {
      this.uiData.storage.savedShown = true;
      this.window.setTimeout(() => {
          this.uiData.storage.savedShown = false; }, 5000);
    } else {
      this.window.alert('Failed to store PasteBin key in storage :(');
    }
  }

  getUiData() {
    return this.uiData;
  }
}