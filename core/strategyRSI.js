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

  if (rsi > 70) {
    return {
      symbol,
      strategy: 'RSI_OVERBOUGHT',
      message: `🔴 [${symbol}] RSI = ${rsi} → Возможен откат (перекупленность)`,
    };
  }

  return null;
}

module.exports = {
  checkRSIStrategy
};
