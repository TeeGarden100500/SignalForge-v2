function calculateRSI(candles, period = 14) {
  if (candles.length < period + 1) return null;

  let gains = 0;
  let losses = 0;

  for (let i = candles.length - period - 1; i < candles.length - 1; i++) {
    const diff = candles[i + 1].close - candles[i].close;
    if (diff >= 0) {
      gains += diff;
    } else {
      losses += Math.abs(diff);
    }
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);

  return +rsi.toFixed(2);
}

module.exports = {
  calculateRSI
};
