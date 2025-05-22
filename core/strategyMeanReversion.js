const { calculateMeanReversion } = require('./indicators');

function checkMeanReversionStrategy(symbol, candles, timeframe) {
  const result = calculateMeanReversion(candles);
  if (!result) return null;

  const { close, ma } = result;

  const deviation = ((close - ma) / ma) * 100;
  const threshold = 2.0;

if (deviation <= -threshold) {
  return {
    symbol, timeframe,
    strategy: 'MEAN_REVERS',
    tag: 'MEAN_REVERS_DOWN',
    message: `🟦 [${symbol}] Цена ниже MA на ${Math.abs(deviation).toFixed(2)}% (${close} < ${ma})`
  };
}

if (deviation > 3) {
  return {
    symbol, timeframe,
    strategy: 'MEAN_REVERS',
    tag: 'MEAN_REVERS_UP',
    message: `🟦 [${symbol}] Цена выше MA на ${deviation.toFixed(2)}% (${close} > ${ma})`
  };
}

  return null;
}
module.exports = {
  checkMeanReversionStrategy,
};
