const { comboStrategies } = require('../comboStrategies');

function checkComboStrategies(symbol, signals) {
  const fired = [];

  for (const combo of comboStrategies) {
    const matched = combo.conditions.every(cond => signals.includes(cond));
    if (matched) {
      fired.push({
        symbol,
        name: combo.name,
        message: combo.message,
        direction: combo.direction
      });
    }
  }

  return fired;
}

module.exports = {
  checkComboStrategies
};
