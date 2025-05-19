const { calculateEMA } = require('./indicators');
const { calculateEMAAngle } = require('./indicators');

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
function checkEMAAngleStrategy(candles, period = 21, depth = 5) {
  const requiredCandles = period + depth;
  if (candles.length < requiredCandles) return null;

  // Выделяем отрезки
  const firstSegment = candles.slice(-requiredCandles, -depth); // первые period свечей
  const lastSegment = candles.slice(-period);                   // последние period свечей

  // Вычисляем EMA на начальном и конечном отрезке
  const emaStart = calculateEMA(firstSegment, period);
  const emaEnd = calculateEMA(lastSegment, period);

  if (emaStart == null || emaEnd == null) return null;

  const delta = emaEnd - emaStart;
  const angle = +(delta / depth).toFixed(4); // Наклон EMA между отрезками

  return {
    emaStart,
    emaEnd,
    angle,
  };
}



module.exports = {
  checkEMACrossoverStrategy,
  checkEMAAngleStrategy,
};
