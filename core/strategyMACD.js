const { calculateMACD } = require('./indicators');

let lastMACD = {};

function checkMACDStrategy(symbol, candles, interval, timeframe) {
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

  return null;
}

module.exports = {
  checkMACDStrategy
};
