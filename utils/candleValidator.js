const { DEBUG_LOG_LEVEL } = require('../config');
const { logVerbose } = require('./logger');

let skippedStrategies = 0;

function hasEnoughCandles(candles, minRequired, strategyName) {
  const length = Array.isArray(candles) ? candles.length : 0;
  if (length < minRequired) {
    if (DEBUG_LOG_LEVEL === 'verbose') {
      logVerbose(`[SKIP] ${strategyName}: недостаточно данных (${length}/${minRequired})`);
    }
    skippedStrategies++;
    return false;
  }
  return true;
}

function getSkippedStrategies() {
  return skippedStrategies;
}

function resetSkippedStrategies() {
  skippedStrategies = 0;
}

module.exports = {
  hasEnoughCandles,
  getSkippedStrategies,
  resetSkippedStrategies,
};
