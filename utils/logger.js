function logBasic(message) {
  console.log(`[INFO] ${message}`);
}

function logVerbose(message) {
  if (process.env.DEBUG_LOG_LEVEL === 'verbose') {
    console.log(`[VERBOSE] ${message}`);
  }
}

function logError(message) {
  console.error(`[ERROR] ${message}`);
}

function logWarn(message) {
  console.warn(`[WARN] ${message}`);
}

module.exports = {
  basic: logBasic,
  verbose: logVerbose,
  error: logError,
  warn: logWarn,
  logInfo: logBasic,
  logVerbose,
  logError,
  logWarn
};
