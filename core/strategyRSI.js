const { calculateRSI } = require('./indicators');

function checkRSIStrategy(symbol, candles, timeframe) {
  const rsi = calculateRSI(candles);

  if (rsi === null) return null;

  if (rsi < 20) {
    return {
      symbol,
      strategy: 'RSI_OVERSOLD',
      tag: 'RSI_OVERSOLD',
      timeframe,
      message: `🟢 [${symbol}] RSI = ${rsi} → Возможен отскок (перепроданность)`,
    };
  }

  if (rsi > 80) {
    return {
      symbol,
      strategy: 'RSI_OVERBOUGHT',
      tag: 'RSI_OVERBOUGHT',
      timeframe,
      message: `🔴 [${symbol}] RSI = ${rsi} → Возможен откат (перекупленность)`,
    };
  }

  // Простейшая заглушка: если RSI поднялся, а цена упала — дивергенция
const rsiNow = rsi;
const rsiPrev = calculateRSI(candles.slice(0, -1)); // Добавляем эту строку

if (rsiPrev !== null && rsiNow < rsiPrev - 5) {
  return {
    symbol,
    strategy: 'RSI_DROP',
    tag: 'RSI_DROP',
    timeframe,
    message: `📉 [${symbol}] Резкое падение RSI: с ${rsiPrev.toFixed(2)} до ${rsiNow.toFixed(2)}`
  };
}
  return null;
}

module.exports = {
  checkRSIStrategy
};
