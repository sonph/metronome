import * as audioclass from './audio.js'
import * as metronomeclass from './metronome.js'
import * as visualizationclass from './visualization.js'
import * as songchartclass from './songchart.js'
import App from './app.js'

window.init = function() {
  // First, let's shim the requestAnimationFrame API, with a setTimeout fallback
  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame || function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
  })();

  let songChart = new songchartclass.SongChart();

  let audio = new audioclass.Audio();
  audio.loadSamples();

  let viz = new visualizationclass.Viz(window, document, audio);
  viz.initCanvas();

  let metronome = new metronomeclass.Metronome(audio, viz);
  metronome.setSongChart(songChart);

  let app = new App(window);

  let vueApp = new Vue({
    el: '#vueApp',
    data: {
      audio: audio.getUiData(),
      metronome: metronome.getUiData(),
      songChart: songChart.getUiData(),
      app: app.getUiData(),
      window: window
    },
    methods: {
      metronomeToggle: (() => { metronome.toggle(); }),
      metronomeStop: (() => { metronome.stop(); }),
      metronomeTapTempo: (() => { metronome.tapTempo(); }),
      metronomeTempoHalve: (() => { metronome.tempoHalve(); }),
      metronomeTempoDecrementBy10: (() => { metronome.tempoDecrementBy10(); }),
      metronomeTempoDecrementBy5: (() => { metronome.tempoDecrementBy5(); }),
      metronomeTempoDecrement: (() => { metronome.tempoDecrement(); }),
      metronomeTempoIncrement: (() => { metronome.tempoIncrement(); }),
      metronomeTempoIncrementBy5: (() => { metronome.tempoIncrementBy5(); }),
      metronomeTempoIncrementBy10: (() => { metronome.tempoIncrementBy10(); }),
      metronomeTempoDouble: (() => { metronome.tempoDouble(); }),

      songChartSetStartingFromSection: ((index) => { songChart.setStartingFromSection(index); }),
      songChartAppendSection: (() => { songChart.appendSection(); }),
      songChartToggle: (() => { songChart.toggle(); }),

      appShowSettings: (() => { app.showSettings(); }),
      appHideSettings: (() => { app.hideSettings(); }),
      appStorePasteBinKey: (() => { app.storePasteBinKey(); }),

      audioMaybeLoadSample: (() => { audio.maybeLoadSample(); })
    }
  });

}

window.addEventListener('load', window.init);
