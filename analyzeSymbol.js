// src/analyzeSymbol.js

const { applyStrategies } = require('./applyStrategies');
const { sendWebhook } = require('./webhookHandler');
const { getCandlesFor } = require('./candleStore'); // или твой источник

function analyzeSymbol(symbol, interval) {
  const candles = getCandlesFor(symbol, interval); // получаем свечи
  const results = applyStrategies(symbol, candles, interval); // применяем стратегии

  if (results.length > 0) {
    sendWebhook(symbol, results, interval); // отправляем сигнал
  }
}

module.exports = { analyzeSymbol };
