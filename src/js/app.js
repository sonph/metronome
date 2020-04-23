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
        apiKey: this.storage.getApiKey(),
        userKey: this.storage.getUserKey(),
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

  storeKeys() {
    this.uiData.storage.savedShown = false;
    if (this.storage.isStorageAvailable()
        && this.storage.storeKeys(
            this.uiData.storage.userKey,
            this.uiData.storage.apiKey)) {
      this.uiData.storage.savedShown = true;
      this.window.setTimeout(() => {
          this.uiData.storage.savedShown = false; }, 5000);
    } else {
      this.window.alert('Failed to store keys in local storage :(');
    }
  }

  getUiData() {
    return this.uiData;
  }
}