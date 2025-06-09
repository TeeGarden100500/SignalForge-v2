const { DEBUG_LOG_LEVEL } = require('../config');

function verboseLog(...args) {
  if (DEBUG_LOG_LEVEL === 'verbose') {
    console.log(...args);
  }
}

function basicLog(...args) {
  if (DEBUG_LOG_LEVEL !== 'none') {
    console.log(...args);
  }
}

module.exports = {
  verboseLog,
  basicLog
};
