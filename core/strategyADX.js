const { calculateADX } = require('./indicators');

function checkADXStrengthStrategy(symbol, candles, interval) {
  const result = calculateADX(candles, 14);
  if (!result) return null;

  const { adx } = result;

  if (adx > 15) {
  return {
    symbol,
    strategy: 'ADX',
    tag: 'ADX_TREND',
    timeframe,
    message: `📈 [${symbol}] Сильный тренд: ADX = ${adx.toFixed(2)}`
  };
}

  if (adx < 15) {
    return {
      symbol,
      strategy: 'ADX',
      tag: 'ADX_FLAT',
      timeframe,
      message: `💤 [${symbol}] Флэт/слабый тренд. ADX = ${adx}`
    };
  }

  return null;
}

module.exports = {
  checkADXStrengthStrategy
};
