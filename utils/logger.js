// utils/logger.js
const config = require('../config/config');

function logInfo(message) {
  if (['basic', 'verbose'].includes(config.DEBUG_LOG_LEVEL)) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  }
}

function logVerbose(message) {
  if (config.DEBUG_LOG_LEVEL === 'verbose') {
    console.log(`[VERBOSE] ${new Date().toISOString()} - ${message}`);
  }
}

function logError(message) {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
}

module.exports = {
  logInfo,
  logVerbose,
  logError,
  basic: logInfo,
  verbose: logVerbose,
  error: logError
};
