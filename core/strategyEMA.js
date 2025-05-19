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
function checkEMAAngleStrategy(symbol, candles, interval) {
  const result = calculateEMAAngle(candles, 21, 5);

  if (!result) {
    console.log(`[DEBUG] EMA angle result is NULL for ${symbol}`);
    return null;
  }

  const { angle, emaStart, emaEnd } = result;
  const threshold = 0.01;

  console.log(`[DEBUG] EMA для ${symbol} | Start: ${emaStart}, End: ${emaEnd}, Angle: ${angle}`);

  if (Math.abs(angle) < threshold) {
    console.log(`[DEBUG] Angle слишком мал для ${symbol}: ${angle}`);
    return null;
  }

  const trend = angle > 0 ? 'вверх ⏫' : 'вниз ⏬';
  return {
    symbol,
    strategy: 'EMA_ANGLE',
    message: `📈 [${symbol}] EMA(21) уверенно наклонён ${trend} (угол: ${angle})`
  };
}

module.exports = {
  checkEMACrossoverStrategy,
  checkEMAAngleStrategy,
};
