// config/config.js
module.exports = {
  INTERVAL: '5m',
  RSI_PERIOD: 60,
  RSI_LOW: 30,
  RSI_HIGH: 70,
  EMA_FAST: 12,
  EMA_SLOW: 26,
  MACD_FAST: 12,
  MACD_SLOW: 26,
  MACD_SIGNAL: 9,
  MEAN_REVERSION_MA_PERIOD: 30,
  MEAN_REVERSION_THRESHOLD: 0.5,
  ATR_PERIOD: 14,
  MIN_ATR_PERCENT: 0.5,
  ADX_PERIOD: 14,
  MIN_ADX: 20,
  VOLUME_LOOKBACK: 20,
  VOLUME_SPIKE_MULTIPLIER: 2.5,
  BREAKOUT_LOOKBACK: 60,
  BREAKOUT_MARGIN_PERCENT: 0.05,
  SIGNAL_CONFIRMATION_COUNT: 2,
  SIGNAL_TIME_WINDOW_UTC: { start: '00:00', end: '23:59' },
  WEBHOOK_URL: 'https://webhook.site/b5170fa9-7272-431f-8eeb-66d1e4bc4eec',
  ENABLE_WEBHOOK: true,
  MAX_CACHE_LENGTH: 500,
  DEBUG_LOGGING: true,
  DEBUG_LOG_LEVEL: 'verbose',
  EMA_ANGLE_PERIOD: 3,
  EMA_ANGLE_THRESHOLD: 0.00005,
  EMA_ANGLE_LENGTH: 5,
  VOLATILITY_TOP_COUNT: 50,
  VOLATILITY_LOOKBACK: 30,
  VOLATILITY_REFRESH_INTERVAL_SEC: 3600,
  FIBO_TOLERANCE_PERCENT: 5.5,
  PERCENT_TO_HIGH: 10,
  PERCENT_TO_LOW: 10,
  SUBSCRIPTION_REFRESH_INTERVAL_MS: 5 * 60 * 1000,
};

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
  logError
};
