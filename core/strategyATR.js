const { calculateATR } = require('./indicators');

function checkATRSpikeStrategy(symbol, candles, timeframe) {
  if (candles.length < 16) return null;

  const atr = calculateATR(candles, 14);
  if (!atr) return null;

  const curr = candles.at(-1);
  const prev = candles.at(-2);

  const currTR = Math.max(
    curr.high - curr.low,
    Math.abs(curr.high - prev.close),
    Math.abs(curr.low - prev.close)
  );

  const spikeRatio = currTR / atr;

  if (spikeRatio >= 1.5) {
    return {
      symbol, timeframe,
      strategy: 'ATR_SPIKE',
      tag: 'ATR_SPIKE',
      message: `💥 [${symbol}] Волатильность выше нормы: TR = ${currTR.toFixed(2)}, ATR = ${atr.toFixed(2)} (${spikeRatio.toFixed(2)}x)`
    };
  }

  return null;
  }

module.exports = {
  checkATRSpikeStrategy
};
