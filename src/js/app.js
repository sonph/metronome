export default class App {
  constructor() {
    this.uiData = {
      settings: {
        visible: false,
        flashRedOnFirstBeat: true
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