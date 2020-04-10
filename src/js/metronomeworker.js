var timerID = null;
var interval = 100;

self.onmessage = function(e) {
  if (e.data == 'START') {
    console.log('[worker] starting');
    timerID = setInterval(function() {
      postMessage('TICK');
    }, interval);
  } else if (e.data == 'STOP') {
    console.log('[worker] stopping');
    clearInterval(timerID);
    timerID = null;
  } else if (e.data.interval) {
    console.log('[worker] setting interval');
    interval = e.data.interval;
    console.log('[worker] interval=' + interval);
    if (timerID) {
      clearInterval(timerID);
      timerID = setInterval(function() {
        postMessage('TICK');
      }, interval);
    }
  }
};

postMessage('FINISH');