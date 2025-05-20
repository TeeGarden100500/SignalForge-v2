const { comboStrategies } = require('../comboStrategies');

function checkComboStrategies(symbol, signals) {
  const fired = [];
  let total = 0;
  let firedCount = 0;

  for (const combo of comboStrategies) {
    total++;
    const missing = combo.conditions.filter(cond => !signals.includes(cond));
    if (missing.length === 0) {
      firedCount++;
      fired.push({
        symbol,
        name: combo.name,
        message: combo.message,
        direction: combo.direction
      });
    } else {
      console.log(`❌ COMBO "${combo.name}" НЕ сработала: не хватает тегов: ${missing.join(', ')}`);
    }
  }

  console.log(`📊 Проверено COMBO стратегий: ${total} | Сработало: ${firedCount}`);
  return fired;
}

module.exports = {
  checkComboStrategies
};
