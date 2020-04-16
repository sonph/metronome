export default class App {
  constructor() {
    this.uiData = {
      settings: {
        visible: false,
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