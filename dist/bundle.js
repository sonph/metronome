/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/app.js":
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _audio_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./audio.js */ \"./src/js/audio.js\");\n/* harmony import */ var _metronome_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./metronome.js */ \"./src/js/metronome.js\");\n/* harmony import */ var _visualization_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./visualization.js */ \"./src/js/visualization.js\");\n/* harmony import */ var _songchart_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./songchart.js */ \"./src/js/songchart.js\");\n\n\n\n\n\nwindow.init = function() {\n  // First, let's shim the requestAnimationFrame API, with a setTimeout fallback\n  window.requestAnimFrame = (function() {\n    return window.requestAnimationFrame || window.webkitRequestAnimationFrame ||\n        window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||\n        window.msRequestAnimationFrame || function(callback) {\n          window.setTimeout(callback, 1000 / 60);\n        };\n  })();\n\n  let songChart = new _songchart_js__WEBPACK_IMPORTED_MODULE_3__[\"SongChart\"]();\n\n  let audio = new _audio_js__WEBPACK_IMPORTED_MODULE_0__[\"Audio\"]();\n  audio.unlockAudio();\n  audio.loadAudioFiles();\n\n  let viz = new _visualization_js__WEBPACK_IMPORTED_MODULE_2__[\"Viz\"](window, document, audio);\n  viz.initCanvas();\n\n  let metronome = new _metronome_js__WEBPACK_IMPORTED_MODULE_1__[\"Metronome\"](audio, viz);\n  metronome.setSongChart(songChart);\n\n  let vueApp = new Vue({\n    el: '#vueApp',\n    data: {\n      metronome: metronome.getUiData(),\n      songChart: songChart.getUiData()\n    },\n    methods: {\n      metronomeToggle: (() => { metronome.toggle(); }),\n      metronomeStop: (() => { metronome.stop(); }),\n      metronomeTempoHalve: (() => { metronome.tempoHalve(); }),\n      metronomeTempoDecrementBy10: (() => { metronome.tempoDecrementBy10(); }),\n      metronomeTempoDecrementBy5: (() => { metronome.tempoDecrementBy5(); }),\n      metronomeTempoDecrement: (() => { metronome.tempoDecrement(); }),\n      metronomeTempoIncrement: (() => { metronome.tempoIncrement(); }),\n      metronomeTempoIncrementBy5: (() => { metronome.tempoIncrementBy5(); }),\n      metronomeTempoIncrementBy10: (() => { metronome.tempoIncrementBy10(); }),\n      metronomeTempoDouble: (() => { metronome.tempoDouble(); }),\n\n      songChartAppendSection: (() => { songChart.appendSection(); })\n    }\n  });\n\n}\n\nwindow.addEventListener('load', window.init);\n\n\n//# sourceURL=webpack:///./src/js/app.js?");

/***/ }),

/***/ "./src/js/audio.js":
/*!*************************!*\
  !*** ./src/js/audio.js ***!
  \*************************/
/*! exports provided: Audio */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Audio\", function() { return Audio; });\nclass Audio {\n  constructor() {\n    /** @type {!AudioContext} */\n    this.audioContext = new AudioContext();\n    /** @type {boolean} Whether audio context has been unlocked. */\n    this.unlocked = false;\n  }\n\n  // Play silent buffer to unlock the audio.\n  unlockAudio() {\n    // TODO(sonph): Maybe move this into play() function, only\n    // unlock audio when user presses play for the first time.\n    console.log('[audio.js] unlock audio');\n    if (!this.unlocked) {\n      var buffer = this.audioContext.createBuffer(1, 1, 22050);\n      var node = this.audioContext.createBufferSource();\n      node.buffer = buffer;\n      node.start(0);\n      this.unlocked = true;\n    }\n  }\n\n  getAudioContext() {\n    return this.audioContext;\n  }\n\n  beep(freq, startTime, stopTime) {\n    console.log('[audio.js] beep()');\n    var osc = this.audioContext.createOscillator();\n    osc.connect(this.audioContext.destination);\n    osc.frequency.value = freq;\n    osc.start(startTime);\n    osc.stop(stopTime);\n  }\n\n  loadAudioFiles() {\n  }\n}\n\n\n\n//# sourceURL=webpack:///./src/js/audio.js?");

/***/ }),

/***/ "./src/js/metronome.js":
/*!*****************************!*\
  !*** ./src/js/metronome.js ***!
  \*****************************/
/*! exports provided: Metronome */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Metronome\", function() { return Metronome; });\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ \"./src/js/utils.js\");\n\n\n/** @const {number} */\nconst QUARTER_NOTE = 0;\n/** @const {number} */\nconst EIGHTH_NOTE = 1;\n/** @const {number} */\nconst SIXTEENTH_NOTE = 2;\n\n/** Metronome class for handling scheduling and current beat. */\nclass Metronome {\n  constructor(audio, viz) {\n    /** @type {boolean} */\n    this.isPlaying = false;\n    /** @type {!audio.Audio} */\n    this.audio = audio;\n    this.audioContext = this.audio.getAudioContext();\n\n    this.viz = viz;\n\n    this.timerWorker = this.createTimerWorker();\n    // How frequently to call scheduling function in milli.\n    this.lookaheadMsec = 25.0;\n    // When the next note is due.\n    this.nextNoteTime = 0.0;\n    // How far ahead to schedule audio (sec). This is calculated from lookahead,\n    // and overlaps with next interval (in case the timer is late)\n    this.scheduleAheadTime = 0.1;\n\n    // What note is currently last scheduled?\n    this.current16thNote;\n\n    // Length of 'beep' (in seconds)\n    this.noteLength = 0.05;\n\n    // The start time of the entire sequence.\n    this.startTime;\n\n    this.songChart;\n    // At the beginning the song chart already starts at the first beat. However\n    // the metronome audio has yet to schedule the first note. So don't tick the\n    // the songchart on the first note.\n    this.songChartSkippedFirstNote = false;\n\n    this.uiData = {\n      curMeasure: 1,\n      toggleLabel: 'START',\n      tempo: 120,\n      noteResolution: QUARTER_NOTE\n    };\n  }\n\n  createTimerWorker() {\n    var w = new Worker('src/js/metronomeworker.js');\n    w.onmessage = e => {\n      if (e.data == 'TICK') {\n        // console.log('tick!');\n        this.scheduler();\n      } else {\n        console.log('message: ' + e.data);\n      }\n    };\n    w.postMessage({'interval': this.lookaheadMsec});\n    return w;\n  }\n\n  nextNote() {\n    // Advance current note and time by a 16th note...\n    // Notice this picks up the CURRENT tempo value to calculate beat length.\n    var secondsPerBeat = 60.0 / this.uiData.tempo;\n    // Add beat length to last beat time\n    this.nextNoteTime += 0.25 * secondsPerBeat;\n    // Advance the beat number, wrapping to zero\n    this.current16thNote = (this.current16thNote + 1) % 16;\n    if (this.current16thNote == 0) {\n      this.uiData.curMeasure += 1;\n    }\n\n    if (this.songChartSkippedFirstNote) {\n      if (!this.songChart.tick()) {\n        console.log('[metronome.js] Stopping at end of song.');\n        this.stop();\n      }\n    } else {\n      this.songChartSkippedFirstNote = true;\n    }\n  }\n\n  scheduleNote(beatNumber, time) {\n    // Append note in queue for visualization.\n    this.viz.appendNote({note: beatNumber, time: time});\n\n    if ((this.uiData.noteResolution == EIGHTH_NOTE) && (beatNumber % 2))\n      return;  // we're not playing non-8th 16th notes\n    if ((this.uiData.noteResolution == QUARTER_NOTE) && (beatNumber % 4))\n      return;  // we're not playing non-quarter 8th notes\n\n    var freq;\n    if (beatNumber % 16 === 0) {  // beat 0 == high pitch\n      freq = 880.0;\n    } else if (beatNumber % 4 === 0) {  // quarter notes = medium pitch\n      freq = 440.0;\n    } else {  // other 16th notes = low pitch\n      freq = 220.0;\n    }\n    this.audio.beep(freq, time, time + this.noteLength);\n  }\n\n  scheduler() {\n    // while there are notes that will need to play before the next interval,\n    // schedule them and advance the pointer.\n    while (this.nextNoteTime <\n           (this.audioContext.currentTime + this.scheduleAheadTime)) {\n      this.scheduleNote(this.current16thNote, this.nextNoteTime);\n      this.nextNote();\n    }\n  }\n\n  toggle() {\n    if (!this.isPlaying) {\n      this.start();\n    } else {\n      this.stop();\n    }\n  }\n\n  /** Starts the metronome. */\n  start() {\n    if (!this.isPlaying) {\n      // Must resume audio context after a user gesture on the page.\n      // https://goo.gl/7K7W\n      this.audioContext.resume();\n      this.isPlaying = true;\n      this.current16thNote = 0;\n      this.uiData.curMeasure = 1;\n      this.uiData.toggleLabel = 'STOP';\n      this.nextNoteTime = this.audioContext.currentTime;\n      this.timerWorker.postMessage('START');\n    }\n  }\n\n  /** Stops the metronome and resets. For now assumes reset from the beginning. */\n  stop() {\n    if (this.isPlaying) {\n      this.isPlaying = false;\n      this.current16thNote = 0;\n      this.timerWorker.postMessage('STOP');\n      this.uiData.toggleLabel = 'START';\n      this.songChartSkippedFirstNote = false;\n      this.songChart.reset();\n    }\n  }\n\n  setSongChart(songChart) {\n    _utils_js__WEBPACK_IMPORTED_MODULE_0__[\"checkIsDefined\"]('songChart', songChart);\n    this.songChart = songChart;\n  }\n\n  getUiData() {\n    return this.uiData;\n  }\n\n  setTempo(tempo) {\n    this.uiData.tempo = tempo;\n  }\n\n  tempoHalve() { this.uiData.tempo /= 2; }\n  tempoDecrementBy10() { this.uiData.tempo -= 10; }\n  tempoDecrementBy5() { this.uiData.tempo -= 5; }\n  tempoDecrement() { this.uiData.tempo -= 1; }\n  tempoIncrement() { this.uiData.tempo += 1; }\n  tempoIncrementBy5() { this.uiData.tempo += 5; }\n  tempoIncrementBy10() { this.uiData.tempo += 10; }\n  tempoDouble() { this.uiData.tempo *= 2; }\n}\n\n\n\n\n//# sourceURL=webpack:///./src/js/metronome.js?");

/***/ }),

/***/ "./src/js/songchart.js":
/*!*****************************!*\
  !*** ./src/js/songchart.js ***!
  \*****************************/
/*! exports provided: SongChart */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SongChart\", function() { return SongChart; });\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ \"./src/js/utils.js\");\n\n\n// How many beats in a measure.\nconst BEATS = 4\n\nconst NUT_JSON = {\n  \"name\": \"Nứt\",\n  \"artist\": \"Ngọt\",\n  \"tempo\": \"145\",\n  \"time_signature\": \"4/4\",\n  \"sections\": [\n    {\n      \"name\": \"Intro\",\n      \"length\": 4,\n    },\n    {\n      \"name\": \"Verse\",\n      \"length\": 4,\n    },\n    {\n      \"name\": \"Prechorus\",\n      \"length\": 4,\n    },\n    {\n      \"name\": \"Chorus\",\n      \"length\": 4,\n    }\n  ]\n};\n\n/** Class for handling song charting. */\nclass SongChart {\n  constructor(json) {\n    this.json = json || NUT_JSON;\n\n    this.uiData = {\n      name: this.json.name,\n      artist: this.json.artist,\n      // Current beat of the measure. 1 to BEATS (4).\n      curBeat: 1,\n      // Current measure of the section. 1 to `measures` in json.\n      curMeasure: 1,\n      // Current section name and length in measures.\n      curSectionName: '',\n      curSectionLength: 0,\n      curSectionIndex: 0,\n      sections: this.json.sections,\n    };\n\n    // Current tick of the beat. 0 to 3 (16th notes).\n    this.curTick = 0;\n\n    // Update uiData based on JSON data, e.g. section name and length.\n    this.reset();\n  }\n\n  reset() {\n    this.uiData.curSectionIndex = 0;\n    this.curTick = 0;\n    this.uiData.curBeat = 1;\n    this.uiData.curMeasure = 1;\n    this.uiData.curSectionName = this.json.sections[this.uiData.curSectionIndex].name;\n    this.uiData.curSectionLength = this.json.sections[this.uiData.curSectionIndex].length;\n  }\n\n  /** Returns false if the end has been reached. */\n  tick() {\n    this.curTick += 1;\n    if (this.curTick >= 4) {\n      this.curTick = 0;\n      return this.nextBeat();\n    }\n    return true;\n  }\n\n  /** Update next beat. If it's the end of a measure, update the next measure. */\n  nextBeat() {\n    this.uiData.curBeat += 1;\n    if (this.uiData.curBeat > BEATS) {\n      this.uiData.curBeat = 1;\n      return this.nextMeasure();\n    }\n    return true;\n  }\n\n  /** Update next measure. If it's the end of a section, update the next section. */\n  nextMeasure() {\n    this.uiData.curMeasure += 1;\n    if (this.uiData.curMeasure > this.json.sections[this.uiData.curSectionIndex].length) {\n      this.uiData.curMeasure = 1;\n      return this.nextSection();\n    }\n    return true;\n  }\n\n  /** Update next section. Returns false if the end has been reached. */\n  nextSection() {\n    this.uiData.curSectionIndex += 1;\n    if (this.uiData.curSectionIndex >= this.json.sections.length) {\n      this.reset();\n      return false;\n    }\n    this.uiData.curSectionName = this.json.sections[this.uiData.curSectionIndex].name;\n    this.uiData.curSectionLength = this.json.sections[this.uiData.curSectionIndex].length;\n    return true;\n  }\n\n  getUiData() {\n    return this.uiData;\n  }\n\n  appendSection() {\n    this.json.sections.push({\n        \"name\": \"Untitled\",\n        \"length\": 8,\n    });\n  }\n\n  /**\n   * Fetches song chart from given url.\n   * @param {string} url Url.\n  async fetchFromJson(url) {\n    let response = await fetch(url);\n    let song = await response.json();\n\n    // wait 1 second\n    await new Promise((resolve, reject) => setTimeout(resolve, 1000));\n\n    return song;\n  }\n  */\n}\n\n\n\n//# sourceURL=webpack:///./src/js/songchart.js?");

/***/ }),

/***/ "./src/js/utils.js":
/*!*************************!*\
  !*** ./src/js/utils.js ***!
  \*************************/
/*! exports provided: checkState, checkIsDefined */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"checkState\", function() { return checkState; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"checkIsDefined\", function() { return checkIsDefined; });\nfunction checkState(cond, message) {\n  if (!cond) {\n    console.error(\"[ERROR] INVALID STATE: \" + message);\n  }\n}\n\nfunction checkIsDefined(name, value) {\n  if (typeof value !== 'undefined' && value) {\n    return;\n  }\n  console.error(\"[ERROR] %s is not defined: %s\", name, value);\n}\n\n\n\n//# sourceURL=webpack:///./src/js/utils.js?");

/***/ }),

/***/ "./src/js/visualization.js":
/*!*********************************!*\
  !*** ./src/js/visualization.js ***!
  \*********************************/
/*! exports provided: Viz */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Viz\", function() { return Viz; });\nclass Viz {\n  constructor(window, document, audio) {\n    this.audioContext = audio.getAudioContext();\n    this.window = window;\n    this.document = document;\n    this.canvas;\n    this.canvasContext;\n\n    // The last 'box' we drew on the screen\n    this.last16thNoteDrawn = -1;\n\n    // Notes that have been put into the web audio, and may or may not have\n    // played yet. {note, time}\n    this.notesInQueue = [];\n  }\n\n  /**\n   * Appends note in the queue for visualization.\n   * @param noteAndTime An object with `note` and `time` props.\n   */\n  appendNote(noteAndTime) {\n    this.notesInQueue.push(noteAndTime);\n  }\n\n  initCanvas() {\n    this.canvas = this.document.createElement('canvas');\n    this.canvasContext = this.canvas.getContext('2d');\n    this.canvas.width = this.window.innerWidth;\n    this.canvas.height = this.window.innerHeight;\n    this.canvasContext.strokeStyle = '#ffffff';\n    this.canvasContext.lineWidth = 2;\n\n    var container = this.document.createElement('div');\n    container.className = 'container';\n    container.appendChild(this.canvas);\n\n    this.document.body.appendChild(container);\n\n    this.window.onorientationchange = () => { this.resetCanvas(); };\n    this.window.onresize = () => { this.resetCanvas(); };\n\n    // Starts the drawing loop.\n    this.window.requestAnimFrame(() => {this.draw()});\n  }\n\n  draw() {\n    var currentNote = this.last16thNoteDrawn;\n    var currentTime = this.audioContext.currentTime;\n\n    while (this.notesInQueue.length &&\n           this.notesInQueue[0].time < currentTime) {\n      currentNote = this.notesInQueue[0].note;\n      this.notesInQueue.splice(0, 1);  // remove note from queue\n    }\n\n    // We only need to draw if the note has moved.\n    if (this.last16thNoteDrawn != currentNote) {\n      var x = Math.floor(this.canvas.width / 18);\n      this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);\n      for (var i = 0; i < 16; i++) {\n        this.canvasContext.fillStyle = (currentNote == i) ?\n            ((currentNote % 4 === 0) ? 'red' : 'blue') :\n            'black';\n        this.canvasContext.fillRect(x * (i + 1), x, x / 2, x / 2);\n      }\n      this.last16thNoteDrawn = currentNote;\n    }\n\n    // Set up to draw again\n    this.window.requestAnimFrame(() => {this.draw()});\n  }\n\n  resetCanvas() {\n    // Resize canvas. This will also clears the canvas.\n    this.canvas.width = this.window.innerWidth;\n    this.canvas.height = this.window.innerHeight;\n\n    // Scroll to the top left.\n    this.window.scrollTo(0, 0);\n  }\n}\n\n\n\n//# sourceURL=webpack:///./src/js/visualization.js?");

/***/ })

/******/ });