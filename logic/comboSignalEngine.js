// 🧠 comboSignalEngine.js — проверка срабатывания стратегий и логика вывода

const comboStrategies = require('../strategies/comboStrategies');
const config = require('../config/config');
const logger = require('../utils/logger');
const scoring = require('../core/signalScoring');
const recorder = require('./signalRecorder');

function evaluateComboStrategies(symbol, tf, context) {
  const { conditions, price } = context;

  comboStrategies.forEach(strategy => {
    const matched = strategy.conditions.filter(c => conditions.includes(c));
    const matchRatio = matched.length / strategy.conditions.length;

    if (matchRatio >= 0.9) {
      const strength = scoring.getSignalStrength(matchRatio);
      const logMsg = [
        `\n[comboLog] ${strategy.message}`,
        `↪ ${strategy.explanation}`,
        `↪ Символ: ${symbol} | TF: ${tf} | Цена: ${price} | Сила: ${strength}`
      ].join('\n');

      logger.basic(logMsg);

      // Webhook + JSON лог
      recorder.recordSignal({
        name: strategy.name,
        message: strategy.message,
        explanation: strategy.explanation,
        symbol,
        timeframe: tf,
        price,
        strength,
        timestamp: new Date().toISOString()
      });
    }
  });
}

module.exports = { evaluateComboStrategies };
