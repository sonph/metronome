import * as audioclass from './audio.js'
import * as metronomeclass from './metronome.js'
import * as visualizationclass from './visualization.js'
import * as songchartclass from './songchart.js'

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
  audio.unlockAudio();
  audio.loadAudioFiles();

  let viz = new visualizationclass.Viz(window, document, audio);
  viz.initCanvas();

  let metronome = new metronomeclass.Metronome(audio, viz);
  metronome.setSongChart(songChart);

  let vueApp = new Vue({
    el: '#vueApp',
    data: {
      metronome: metronome.getUiData(),
      songChart: songChart.getUiData()
    },
    methods: {
      metronomeToggle: (() => { metronome.toggle(); }),
      metronomeStop: (() => { metronome.stop(); }),
      metronomeTempoHalve: (() => { metronome.tempoHalve(); }),
      metronomeTempoDecrementBy10: (() => { metronome.tempoDecrementBy10(); }),
      metronomeTempoDecrementBy5: (() => { metronome.tempoDecrementBy5(); }),
      metronomeTempoDecrement: (() => { metronome.tempoDecrement(); }),
      metronomeTempoIncrement: (() => { metronome.tempoIncrement(); }),
      metronomeTempoIncrementBy5: (() => { metronome.tempoIncrementBy5(); }),
      metronomeTempoIncrementBy10: (() => { metronome.tempoIncrementBy10(); }),
      metronomeTempoDouble: (() => { metronome.tempoDouble(); })
    }
  });

}

window.addEventListener('load', window.init);
