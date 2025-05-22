const { calculateMACD } = require('./indicators');

let lastMACD = {};

function checkMACDStrategy(symbol, candles, timeframe) {
  const key = `${symbol}_${interval}`;
  const macd = calculateMACD(candles);
  if (!macd) return null;

  const prev = lastMACD[key];
  lastMACD[key] = macd;

  if (prev && prev.macd < prev.signal && macd.macd > macd.signal) {
    return {
      symbol, timeframe,
      strategy: 'MACD_CROSS_UP',
      tag: 'MACD_CROSS_UP',
      message: `🟢 [${symbol}] MACD пересёк вверх (сигнал на рост)`,
    };
  }

  if (prev && prev.macd > prev.signal && macd.macd < macd.signal) {
    return {
      symbol, timeframe,
      strategy: 'MACD_CROSS_DOWN',
      tag: 'MACD_CROSS_DOWN',
      message: `🔴 [${symbol}] MACD пересёк вниз (сигнал на падение)`,
    };
  }
// Простейшая заглушка MACD-дивергенции
if (candles.length >= 3) {
  const [c1, c2, c3] = candles.slice(-3);
  if (c3.macd > c2.macd && c3.close < c2.close) {
    return {
      symbol, timeframe,
      strategy: 'MACD_DIVERGENCE',
      tag: 'MACD_DIVERGENCE',
      message: `🟢 [${symbol}] Дивергенция по MACD`,
    };
  }
}

  return null;
}

module.exports = {
  checkMACDStrategy
};
