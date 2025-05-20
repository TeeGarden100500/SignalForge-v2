const { calculateMeanReversion } = require('./indicators');

function checkMeanReversionStrategy(symbol, candles, interval) {
  const result = calculateMeanReversion(candles);
  if (!result) return null;

  const { last, ma20 } = result;

  const deviation = ((last - ma20) / ma20) * 100;
  const threshold = 2.0;

  if (deviation <= -threshold) {
    return {
      symbol,
      strategy: 'MEAN_REVERS',
      tag: 'MEAN_REVERS_DOWN',
      message: `🟦 [${symbol}] Цена ниже MA на ${Math.abs(deviation).toFixed(2)}% (${last.close} < ${ma20})`
    };
  }

  if (deviation > 3) {
    return {
      symbol,
      strategy: 'MEAN_REVERS',
      tag: 'MEAN_REVERS_UP',
      message: `🟦 [${symbol}] Цена выше MA на ${deviation.toFixed(2)}% (${last.close} > ${ma20})`
    };
  }

  return null;
}
module.exports = {
  checkMeanReversionStrategy,
};
