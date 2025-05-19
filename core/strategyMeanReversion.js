const { calculateMeanReversion } = require('./indicators');

function checkMeanReversionStrategy(symbol, candles, interval) {
  const result = calculateMeanReversion(candles);
  if (!result) return null;

  const { deviation, close, ma } = result;

  const threshold = 2.0; // % от среднего

  if (deviation >= threshold) {
    return {
      symbol,
      strategy: 'MEAN_REVERS_UP',
      message: `🟥 [${symbol}] Цена выше MA на ${deviation}% (${close} > ${ma})`
    };
  }

  if (deviation <= -threshold) {
    return {
      symbol,
      strategy: 'MEAN_REVERS_DOWN',
      message: `🟦 [${symbol}] Цена ниже MA на ${Math.abs(deviation)}% (${close} < ${ma})`
    };
  }

  return null;
}

module.exports = {
  checkMeanReversionStrategy
};
