var timerID = null;

// Tick interval in milli seconds.
// For reference 1000 / 60f = 16.6ms between frame.
const TICK_INTERVAL_MSEC = 15.0;

self.onmessage = function(e) {
  if (e.data == 'START') {
    console.log('[worker] starting');
    timerID = setInterval(function() {
      postMessage('TICK');
    }, TICK_INTERVAL_MSEC);
  } else if (e.data == 'STOP') {
    console.log('[worker] stopping');
    clearInterval(timerID);
    timerID = null;
  }
};

postMessage('FINISH');