export default class App {
  constructor() {
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

  popOut() {
    window.open(
      'index.html',
      '_blank',
      'width=400,height=600,resizable=no,scrollbars=no,menubar=no,location=no,status=no,toolbar=no');
  }

  getUiData() {
    return this.uiData;
  }
}