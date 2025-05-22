const { detectBreakout } = require('./indicators');

function checkBreakoutStrategy(symbol, candles, timeframe) {
  if (!Array.isArray(candles) || candles.length < 3) return null;

  const prevHigh = candles.at(-2).high;
  const prevLow = candles.at(-2).low;
  const current = candles.at(-1);

  if (current.high > prevHigh) {
    return {
      symbol, timeframe,
      strategy: 'BREAKOUT',
      tag: 'BREAKOUT_UP',
      tags: ['BREAKOUT', 'BREAKOUT_UP'],
      message: `🚀 [${symbol}] Пробой вверх! Цена ${current.high} выше HIGH ${prevHigh}`
    };
  }

  if (current.low < prevLow) {
    return {
      symbol, timeframe,
      strategy: 'BREAKOUT',
      tag: 'BREAKOUT_DOWN',
      tags: ['BREAKOUT', 'BREAKOUT_DOWN'],
      message: `🔻 [${symbol}] Пробой вниз! Цена ${current.low} ниже LOW ${prevLow}`
    };
  }

  return null;
}

module.exports = { checkBreakoutStrategy };
