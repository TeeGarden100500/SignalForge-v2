const { calculateFiboLevels } = require('./indicators');

function checkFiboProximityStrategy(symbol, candles, interval) {
  const fibo = calculateFiboLevels(candles, 30);
  if (!fibo) return null;

  const { levels } = fibo;
  const close = candles.at(-1).close;
  const threshold = close * 1.5; // 0.5% отклонение

  for (const [label, price] of Object.entries(levels)) {
    if (Math.abs(close - price) <= threshold) {
      return {
        symbol,
        strategy: 'FIBO_TOUCH',
        tag: 'FIBO_TOUCH',
        message: `📐 [${symbol}] Цена рядом с FIBO ${label} (${close} ≈ ${price})`
      };
    }
  }

  return null;
}

module.exports = {
  checkFiboProximityStrategy
};
