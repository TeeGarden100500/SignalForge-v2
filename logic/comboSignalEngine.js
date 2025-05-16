logic/comboSignalEngine.js
const config = require('../config/config');
const { logInfo } = require('../utils/logger');
const strategies = require('../strategies/comboStrategies');

function evaluateComboStrategies(context) {
  strategies.forEach(strategy => {
    const conditionsMet = strategy.conditions.every(cond => context.conditions.includes(cond));

    if (conditionsMet) {
      const msg = `📢 [${strategy.name}] ${strategy.message} | ${context.symbol} | TF: ${context.timeframe}`;
      logInfo(`[comboLog] ${msg}`);

      if (config.ENABLE_WEBHOOK) {
        // Отправка на webhook — можно подключить later
      }
    }
  });
}

module.exports = {
  evaluateComboStrategies
};
