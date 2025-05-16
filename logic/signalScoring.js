// logic/signalScoring.js
function getSignalStrength(matchedConditionsCount, totalConditionsCount) {
  const ratio = matchedConditionsCount / totalConditionsCount;

  if (ratio >= 0.9) return 'strong';
  if (ratio >= 0.6) return 'moderate';
  return 'weak';
}

module.exports = {
  getSignalStrength
};

// обновление в comboSignalEngine.js
const config = require('../config/config');
const { logInfo } = require('../utils/logger');
const strategies = require('../strategies/comboStrategies');

function evaluateComboStrategies(context) {
  strategies.forEach(strategy => {
    const matched = strategy.conditions.filter(cond => context.conditions.includes(cond));
    const strength = getSignalStrength(matched.length, strategy.conditions.length);

    if (matched.length === strategy.conditions.length) {
      const msg = `📢 [${strategy.name}] ${strategy.message} | ${context.symbol} | TF: ${context.timeframe} | Сила: ${strength}`;
      logInfo(`[comboLog] ${msg}`);

      if (config.ENABLE_WEBHOOK) {
        // TODO: отправка webhook-сообщения
      }
    }
  });
}

module.exports = {
  evaluateComboStrategies
};
