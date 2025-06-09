const { DEBUG_LOG_LEVEL } = require('../config');

function verboseLog(...args) {
  if (DEBUG_LOG_LEVEL === 'verbose') {
    console.log(...args);
  }
}

// alias for verbose logging using a more explicit name
function logVerbose(...args) {
  if (DEBUG_LOG_LEVEL === 'verbose') {
    console.debug(...args);
  }
}

function basicLog(...args) {
  if (DEBUG_LOG_LEVEL !== 'none') {
    console.log(...args);
  }
}

module.exports = {
  verboseLog,
  logVerbose,
  basicLog
};
