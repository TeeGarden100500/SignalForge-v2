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
  
    const deviation = ((last.close - ma20) / ma20) * 100;

  if (deviation > 3) {
    return {
    symbol,
    strategy: 'MEAN_REVERSION',
    tag: 'MEAN_REVERS_UP',
    message: `🟦 [${symbol}] Цена выше MA на ${deviation.toFixed(2)}% (${last.close} > ${ma20})`
    };
  }
 
  return null;
}

module.exports = {
  checkMeanReversionStrategy
};
