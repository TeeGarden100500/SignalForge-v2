const { calculateEMA } = require('./indicators');
const { calculateEMAAngle } = require('./indicators');

let lastDirection = {}; // для хранения предыдущего пересечения

function checkEMACrossStrategy(symbol, candles) {
  if (!Array.isArray(candles) || candles.length < 22) return null;

  const closes = candles.map(c => c.close);
  const emaShort = calculateEMA(closes, 9);
  const emaLong = calculateEMA(closes, 21);

  const prevCross = emaShort.at(-2) - emaLong.at(-2);
  const currentCross = emaShort.at(-1) - emaLong.at(-1);

  if (prevCross < 0 && currentCross > 0) {
    return {
      symbol,
      strategy: 'EMA_CROSS',
      tag: 'EMA_CROSS',
      message: `🔼 [${symbol}] EMA пересекла вверх: EMA9 > EMA21`
    };
  }

  return null;
}

function checkEMAAngleStrategy(symbol, candles, interval) {
  const result = calculateEMAAngle(candles, 21, 21);

  if (!result) {
    console.log(`[DEBUG] EMA angle result is NULL for ${symbol}`);
    return null;
  }

  const { angle, emaStart, emaEnd } = result;
  const threshold = 0.001;

  console.log(`[DEBUG] EMA для ${symbol} | Start: ${emaStart}, End: ${emaEnd}, Angle: ${angle}`);

  if (Math.abs(angle) < threshold) {
    console.log(`[DEBUG] Angle слишком мал для ${symbol}: ${angle}`);
    return null;
  }

  const trend = angle > 0 ? 'вверх ⏫' : 'вниз ⏬';
  return {
    symbol,
    strategy: 'EMA_ANGLE',
    tag: 'EMA_ANGLE',
    message: `📈 [${symbol}] EMA(21) уверенно наклонён ${trend} (угол: ${angle})`
  };
}

module.exports = {
  checkEMACrossStrategy,
  checkEMAAngleStrategy,
};
