const TEMPO_BOX_ID = 'tempoBox';

export default class Shortcuts {
  constructor(window) {
    this.window = window;
  }

  bindMetronome(metronome) {
    this.window.Mousetrap.bindGlobal('.', function (e) {
      e.preventDefault();
      metronome.tapTempo();
    });
    this.window.Mousetrap.bindGlobal('t', function (e) {
      e.preventDefault();
      window.document.getElementById(TEMPO_BOX_ID).focus();
    });
    this.window.Mousetrap.bindGlobal('space', function (e) {
      e.preventDefault();
      metronome.toggle();
    });
    this.window.Mousetrap.bindGlobal('up', function () {
      if (document.activeElement.tagName !== 'INPUT') {
        metronome.tempoIncrement();
      }
    });
    this.window.Mousetrap.bindGlobal('down', function () {
      if (document.activeElement.tagName !== 'INPUT') {
        metronome.tempoDecrement();
      }
    });
    this.window.Mousetrap.bindGlobal('left', function () {
      if (document.activeElement.tagName !== 'INPUT') {
        metronome.tempoDecrementBy5();
      }
    });
    this.window.Mousetrap.bindGlobal('right', function () {
      if (document.activeElement.tagName !== 'INPUT') {
        metronome.tempoIncrementBy5();
      }
    });
    this.window.Mousetrap.bindGlobal('j', function () {
      metronome.tempoDecrement();
    });
    this.window.Mousetrap.bindGlobal('k', function () {
      metronome.tempoIncrement();
    });
    this.window.Mousetrap.bindGlobal('m', function () {
      metronome.tempoDecrementBy5();
    });
    this.window.Mousetrap.bindGlobal(',', function () {
      metronome.tempoIncrementBy5();
    });
  }
}