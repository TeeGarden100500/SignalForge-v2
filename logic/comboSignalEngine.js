logic/comboSignalEngine.js
const config = require('../config/config');
const { logInfo } = require('../utils/logger');
const strategies = require('../strategies/comboStrategies');
const { getSignalStrength } = require('./signalScoring');
const { recordSignal } = require('./signalRecorder');

function evaluateComboStrategies(context) {
  strategies.forEach(strategy => {
    const matched = strategy.conditions.filter(cond => context.conditions.includes(cond));
    const strength = getSignalStrength(matched.length, strategy.conditions.length);

    if (matched.length === strategy.conditions.length) {
      const logEntry = {
        name: strategy.name,
        symbol: context.symbol,
        timeframe: context.timeframe,
        direction: strategy.direction,
        message: strategy.message,
        strength,
        price: context.price  // <-- Добавлена текущая цена
      };

      logInfo(`[comboLog] 📢 [${strategy.name}] ${strategy.message} | ${context.symbol} | TF: ${context.timeframe} | Сила: ${strength} | Цена: ${context.price}`);

      recordSignal(logEntry);
    }
  });
}

module.exports = {
  evaluateComboStrategies
};
