function checkState(cond, message) {
  if (!cond) {
    console.error("[ERROR] INVALID STATE: " + message);
  }
}

function checkIsDefined(name, value) {
  if (typeof value !== 'undefined') {
    if (value) {
      return;
    }
  }
  console.error("[ERROR] %s is not defined: %s", name, value);
}

export { checkState, checkIsDefined };