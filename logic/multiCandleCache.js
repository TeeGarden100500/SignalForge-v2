// logic/multiCandleCache.js
const config = require('../config/config');
const { logVerbose } = require('../utils/logger');

const cache = {};

function handleIncomingCandle(symbol, interval, kline) {
  if (!cache[symbol]) cache[symbol] = {};
  if (!cache[symbol][interval]) cache[symbol][interval] = [];

  const entry = {
    openTime: kline.t,
    open: parseFloat(kline.o),
    high: parseFloat(kline.h),
    low: parseFloat(kline.l),
    close: parseFloat(kline.c),
    volume: parseFloat(kline.v),
    closeTime: kline.T
  };

  const candles = cache[symbol][interval];
  candles.push(entry);
  if (candles.length > config.MAX_CACHE_LENGTH) candles.shift();

  logVerbose(`Кэш обновлён: ${symbol} [${interval}] => ${candles.length} свечей`);

  // Тут можно триггерить анализ при достижении MIN_CACHE_LENGTH, например:
  if (candles.length >= config.RSI_PERIOD) {
    // TODO: анализ индикаторов и стратегий
  }
}

module.exports = {
  handleIncomingCandle,
  cache
};
