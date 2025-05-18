const { calculateEMA } = require('./indicators');

let lastDirection = {}; // для хранения предыдущего пересечения

function checkEMACrossoverStrategy(symbol, candles, interval) {
  if (candles.length < 30) return null;

  const short = calculateEMA(candles, 9);
  const long = calculateEMA(candles, 21);
  if (!short || !long) return null;

  const key = `${symbol}_${interval}`;
  const prev = lastDirection[key];
  const current = short > long ? 'above' : 'below';

  // сохраняем новое направление
  lastDirection[key] = current;

  if (!prev || prev === current) return null;

  const direction = current === 'above' ? 'LONG' : 'SHORT';
  const emoji = direction === 'LONG' ? '🟢' : '🔴';

  return {
    symbol,
    strategy: 'EMA_CROSSOVER',
    message: `${emoji} [${symbol}] EMA(9) ${direction === 'LONG' ? 'пересёк вверх' : 'пересёк вниз'} EMA(21)`
  };
}

module.exports = {
  checkEMACrossoverStrategy
};
