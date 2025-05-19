const { calculateRSI } = require('./indicators');

function checkRSIStrategy(symbol, candles) {
  const rsi = calculateRSI(candles);

  if (rsi === null) return null;

  if (rsi < 40) {
    return {
      symbol,
      strategy: 'RSI_REBOUND',
      message: `🟢 [${symbol}] RSI = ${rsi} → Возможен отскок (перепроданность)`,
    };
  }

  if (rsi > 60) {
    return {
      symbol,
      strategy: 'RSI_OVERBOUGHT',
      message: `🔴 [${symbol}] RSI = ${rsi} → Возможен откат (перекупленность)`,
    };
  }
// Простейшая заглушка: если RSI поднялся, а цена упала — дивергенция
if (candles.length >= 3) {
  const [c1, c2, c3] = candles.slice(-3);
  if (c3.rsi > c2.rsi && c3.close < c2.close) {
    return {
      symbol,
      strategy: 'RSI_HIDDEN_BULL',
      message: `🟢 [${symbol}] Скрытая бычья дивергенция RSI`,
      tag: 'RSI_HIDDEN_BULL',
    };
  }
}

  return null;
}

module.exports = {
  checkRSIStrategy
};
