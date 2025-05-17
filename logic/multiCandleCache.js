// logic/multiCandleCache.js
const config = require('../config/config');
const { logVerbose } = require('../utils/logger');
const { runBasicIndicators } = require('./strategyManager');
const { evaluateComboStrategies } = require('./comboSignalEngine');

const cache = {};

function handleIncomingCandle(symbol, interval, kline) {
  try {
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

    if (interval === config.TIMEFRAMES.LEVEL_1 && candles.length >= config.RSI_PERIOD) {
      runBasicIndicators(symbol, candles);

      // Тестовый контекст для проверки комбинаций
      const context = {
        symbol,
        timeframe: interval,
        price: entry.close,
        conditions: ['RSI_LOW', 'EMA_CROSS_UP', 'MACD_HIST_FLIP'] // TODO: сюда подставлять реальные условия
      };
      evaluateComboStrategies(context);
    }

  } catch (err) {
    console.error(`[cache] Ошибка обработки свечи для ${symbol} (${interval}):`, err.message);
    console.debug(`[cache] Содержание свечи: ${JSON.stringify(kline)}`);
  }
}


module.exports = {
  handleIncomingCandle,
  cache
};
