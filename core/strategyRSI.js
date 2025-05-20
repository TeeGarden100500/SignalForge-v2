const { calculateRSI } = require('./indicators');

function checkRSIStrategy(symbol, candles) {
  const rsi = calculateRSI(candles);

  if (rsi === null) return null;

  if (rsi < 30) {
    return {
      symbol,
      strategy: 'RSI_OVERSOLD',
      tag: 'RSI_OVERSOLD',
      message: `🟢 [${symbol}] RSI = ${rsi} → Возможен отскок (перепроданность)`,
    };
  }

  if (rsi > 70) {
    return {
      symbol,
      strategy: 'RSI_OVERBOUGHT',
      tag: 'RSI_OVERBOUGHT',
      message: `🔴 [${symbol}] RSI = ${rsi} → Возможен откат (перекупленность)`,
    };
  }

  // Простейшая заглушка: если RSI поднялся, а цена упала — дивергенция
const rsiNow = rsi;
const rsiPrev = calculateRSI(candles.slice(0, -1)); // Добавляем эту строку

if (rsiPrev !== null && rsiNow < rsiPrev - 10) {
  return {
    symbol,
    strategy: 'RSI_DROP',
    tag: 'RSI_DROP',
    message: `📉 [${symbol}] Резкое падение RSI: с ${rsiPrev.toFixed(2)} до ${rsiNow.toFixed(2)}`
  };
}
  return null;
}

module.exports = {
  checkRSIStrategy
};
