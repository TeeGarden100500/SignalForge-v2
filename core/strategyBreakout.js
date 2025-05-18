const { detectBreakout } = require('./indicators');

function checkBreakoutStrategy(symbol, candles, interval) {
  const result = detectBreakout(candles);
  if (!result) return null;

  const { breakoutUp, breakoutDown, high, low, close } = result;

  if (breakoutUp) {
    return {
      symbol,
      strategy: 'BREAKOUT',
      message: `🚀 [${symbol}] Пробой вверх! Цена ${close} выше HIGH ${high}`
    };
  }

  if (breakoutDown) {
    return {
      symbol,
      strategy: 'BREAKOUT',
      message: `🔻 [${symbol}] Пробой вниз! Цена ${close} ниже LOW ${low}`
    };
  }

  return null;
}

module.exports = {
  checkBreakoutStrategy
};
