import * as audioclass from './audio.js'
import * as metronomeclass from './metronome.js'
import * as visualizationclass from './visualization.js'
import * as songchartclass from './songchart.js'

let nutJson = {
  "name": "Nứt",
  "artist": "Ngọt",
  "tempo": "145",
  "time_signature": "4/4",
  "sections": [
    {
      "name": "Intro",
      "measures": 4,
    },
    {
      "name": "Verse",
      "measures": 4,
    },
    {
      "name": "Prechorus",
      "measures": 4,
    },
    {
      "name": "Chorus",
      "measures": 4,
    }
  ]
};

window.init = function() {
  // First, let's shim the requestAnimationFrame API, with a setTimeout fallback
  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame || function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
  })();

  let songChart = new songchartclass.SongChart(
    nutJson, document.getElementById('sectionName'));

  let audio = new audioclass.Audio();
  audio.unlockAudio();
  audio.loadAudioFiles();

  let viz = new visualizationclass.Viz(window, document, audio);
  viz.initCanvas();

  let metronome = new metronomeclass.Metronome(audio, viz);
  metronome.setSongChart(songChart);
  metronome.setDomElements(document);

  window.metronome = metronome;
}

window.addEventListener('load', window.init);
