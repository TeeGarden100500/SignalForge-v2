const { calculateEMA } = require('./indicators');
const { calculateEMAAngle } = require('./indicators');
const { DEBUG_LOG_LEVEL, STRATEGY_REQUIREMENTS, EMA_ANGLE_THRESHOLD } = require('../config');
const { EMA_PERIOD, EMA_DEPTH, EMA_REQUIRED_CANDLES, EMA_SHORT_PERIOD, EMA_LONG_PERIOD } = require('../config');
const { hasEnoughCandles } = require('../utils/candleValidator');
const { logVerbose } = require('../utils/logger');

let lastDirection = {}; // для хранения предыдущего пересечения

function checkEMACrossStrategy(symbol, candles, timeframe) {
  if (!Array.isArray(candles) || candles.length < EMA_REQUIRED_CANDLES) return null;

  const closes = candles.map(c => c.close);
  const emaShort = calculateEMA(closes, EMA_SHORT_PERIOD);
  const emaLong = calculateEMA(closes, EMA_LONG_PERIOD);

  const prevCross = emaShort.at(-2) - emaLong.at(-2);
  const currentCross = emaShort.at(-1) - emaLong.at(-1);

  if (prevCross < 0 && currentCross > 0) {
    return {
      symbol, timeframe,
      strategy: 'EMA_CROSS',
      tag: 'EMA_CROSS',
      message: `🔼 [${symbol}] EMA пересекла вверх: EMA${EMA_SHORT_PERIOD} > EMA${EMA_LONG_PERIOD}`
    };
  }

  return null;
}

  function checkEMAAngleStrategy(symbol, candles, timeframe) {
  const minRequiredCandles = STRATEGY_REQUIREMENTS.EMA_ANGLE || 40;
  if (!hasEnoughCandles(candles, minRequiredCandles, 'EMA_ANGLE')) return null;

  const result = calculateEMAAngle(candles, EMA_PERIOD, EMA_DEPTH);

  if (!result) return null;

  const { angle, emaStart, emaEnd } = result;
  const threshold = EMA_ANGLE_THRESHOLD; 

  if (DEBUG_LOG_LEVEL === 'verbose') {
    logVerbose(`[DEBUG] EMA для ${symbol} | Start: ${emaStart}, End: ${emaEnd}, Angle: ${angle}`);
  }
  if (!emaStart || !emaEnd || isNaN(angle)) {
    if (DEBUG_LOG_LEVEL === 'verbose') {
      logVerbose(`📉 [DEBUG] Invalid EMA values: { emaStart: ${emaStart}, emaEnd: ${emaEnd} }`);
    }
    return null;
  }

  if (Math.abs(angle) < threshold) {
    if (DEBUG_LOG_LEVEL === 'verbose') {
      logVerbose(`[DEBUG] Angle слишком мал для ${symbol}: ${angle}`);
    }
    return null;
  }

  const trend = angle > 0 ? 'вверх ⏫' : 'вниз ⏬';
  return {
    symbol,
    timeframe,
    strategy: 'EMA_ANGLE',
    tag: 'EMA_ANGLE',
    message: `📐 [${symbol}] EMA угол наклона: ${angle}`,
    angle
  };
}

module.exports = {
  checkEMACrossStrategy,
  checkEMAAngleStrategy,
};
