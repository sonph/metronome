var sprintf = (str, ...argv) => !argv.length ? str : 
    sprintf(str = str.replace(sprintf.token||"$", argv.shift()), ...argv);
    
function checkState(cond, message, ...argv) {
  if (!cond) {
    console.error("[ERROR] INVALID STATE: " + sprintf(message, ...argv));
  }
}

function checkIsDefined(name, value) {
  if (typeof value !== 'undefined') {
    if (value !== null){
      return;
    }
  }
  console.error("[ERROR] %s is not defined: %s", name, value);
}

export { checkState, checkIsDefined, sprintf };