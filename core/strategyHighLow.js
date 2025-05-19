const { detectHighLowProximity } = require('./indicators');

function checkHighLowProximity(symbol, candles, interval) {
  const result = detectHighLowProximity(candles);
  if (!result) return null;

  const { nearHigh, nearLow, high, low, close } = result;

  if (nearHigh) {
    return {
      symbol,
      strategy: 'PROX_HIGH',
      message: `🟠 [${symbol}] Цена рядом с HIGH (${close} ≈ ${high})`
    };
  }

  if (nearLow) {
    return {
      symbol,
      strategy: 'PROX_LOW',
      message: `🔵 [${symbol}] Цена рядом с LOW (${close} ≈ ${low})`
    };
  }

  return null;
}

module.exports = {
  checkHighLowProximity
};
