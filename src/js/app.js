export default class App {
  constructor() {
    this.uiData = {
      settingsVisible: null
    };
  }

  showSettings() {
    this.uiData.settingsVisible = true;
  }

  hideSettings() {
    this.uiData.settingsVisible = false;
  }

  getUiData() {
    return this.uiData;
  }
}