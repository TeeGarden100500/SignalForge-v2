const { detectHighLowProximity } = require('./indicators');

function checkHighLowProximity(symbol, candles, interval, mode = 'strict') {
  const threshold = mode === 'loose' ? 10 : 1.5;
  const result = detectHighLowProximity(candles, 20, threshold);
  if (!result) return null;

  const { nearHigh, nearLow, high, low, close } = result;

  if (nearHigh) {
    return {
      symbol,
      strategy: mode === 'loose' ? 'PROX_HIGH_L' : 'PROX_HIGH',
      message: `🟠 [${symbol}] Цена рядом с HIGH (${close} ≈ ${high}) [${mode}]`
    };
  }

  if (nearLow) {
    return {
      symbol,
      strategy: mode === 'loose' ? 'PROX_LOW_L' : 'PROX_LOW',
      message: `🔵 [${symbol}] Цена рядом с LOW (${close} ≈ ${low}) [${mode}]`
    };
  }

  return null;
}

module.exports = {
  checkHighLowProximity
};
