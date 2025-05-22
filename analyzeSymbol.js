const { applyStrategies } = require('./core/applyStrategies');
const { sendWebhook } = require('./webhookHandler');
const { getCandleCache } = require('./wsHandler'); // 🔄 подключение из wsHandler

function getCandlesFor(symbol, interval) {
  const cache = getCandleCache();
  return cache[symbol]?.[interval] || [];
}

function analyzeSymbol(symbol, interval) {
  const candles = getCandlesFor(symbol, interval);      // получаем свечи
  const results = applyStrategies(symbol, candles, interval); // применяем стратегии

  if (results.length > 0) {
    sendWebhook(symbol, results, interval);             // отправляем сигнал
  }
}

module.exports = { analyzeSymbol };
