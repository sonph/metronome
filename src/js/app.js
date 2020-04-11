import * as audioclass from './audio.js'
import * as metronomeclass from './metronome.js'
import * as visualizationclass from './visualization.js'

window.init =
    function() {
  console.log('[app.js] init()');

  // First, let's shim the requestAnimationFrame API, with a setTimeout fallback
  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame || function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
  })();

  var audio = new audioclass.Audio();
  audio.unlockAudio();
  audio.loadAudioFiles();

  var viz = new visualizationclass.Viz(window, document, audio);
  viz.initCanvas();

  var metronome = new metronomeclass.Metronome(audio, viz);

  window.metronome = metronome;
}

    window.addEventListener('load', window.init);
