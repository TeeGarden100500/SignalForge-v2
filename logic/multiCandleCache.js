// logic/multiCandleCache.js
const config = require('../config/config');
const { logVerbose } = require('../utils/logger');
const { runBasicIndicators } = require('./strategyManager');
const { evaluateComboStrategies } = require('./comboSignalEngine');

const cache = {};

function handleIncomingCandle(candle) {
  try {
    const { symbol, tf: interval, time, open, high, low, close, volume } = candle;

    if (!cache[symbol]) cache[symbol] = {};
    if (!cache[symbol][interval]) cache[symbol][interval] = [];

    const entry = {
      openTime: time,
      open,
      high,
      low,
      close,
      volume,
      closeTime: time
    };

    const candles = cache[symbol][interval];
    candles.push(entry);
    if (candles.length > config.MAX_CACHE_LENGTH) candles.shift();

    logVerbose(`Кэш обновлён: ${symbol} [${interval}] => ${candles.length} свечей`);

    if (interval === config.TIMEFRAMES.LEVEL_1 && candles.length >= config.RSI_PERIOD) {
      runBasicIndicators(symbol, candles);

      const context = {
        symbol,
        timeframe: interval,
        price: close,
        conditions: ['RSI_LOW', 'EMA_CROSS_UP', 'MACD_HIST_FLIP']
      };

      evaluateComboStrategies(context);
    }

  } catch (err) {
    console.error(`[cache] Ошибка обработки свечи для ${candle?.symbol || '??'} (${candle?.tf || '??'}):`, err.message);
    console.debug(`[cache] Содержание свечи: ${JSON.stringify(candle)}`);
  }
}

module.exports = {
  handleIncomingCandle,
  cache
};
