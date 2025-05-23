const fs = require('fs');
const path = require('path');
const { comboStrategies } = require('../comboStrategies');

const logFilePath = path.join(__dirname, '../logs/combo_debug.log');

// Убедимся, что папка logs существует
if (!fs.existsSync(path.dirname(logFilePath))) {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

function logToFile(message) {
  fs.appendFileSync(logFilePath, message + '\n');
}

function checkComboStrategies(symbol, signals, timeframe) {
  const fired = [];
  let total = 0;
  let firedCount = 0;

  for (const combo of comboStrategies) {
    total++;
    const missing = combo.conditions.filter(cond => !signals.includes(cond));

    if (missing.length === 0) {
      firedCount++;

      // 🛠 Правильный вызов message как функции
      const msg = typeof combo.message === 'function'
        ? combo.message(symbol, timeframe)
        : combo.message;

      const logLine = `✅ COMBO "${combo.name}" сработала для ${symbol} [${timeframe}]: ${msg}`;
      console.log(logLine);
      logToFile(logLine);

      fired.push({
        symbol,
        timeframe,
        name: combo.name,
        message: msg, // ✅ готовая строка, не функция
        direction: combo.direction
      });
    }
/*     else {
      const msg = `❌ COMBO "${combo.name}" НЕ сработала для ${symbol}: не хватает тегов: ${missing.join(', ')}`;
      console.log(msg);
      logToFile(msg);
     }
*/   }

/*  const summary = `📊 Проверено COMBO стратегий: ${total} | Сработало: ${firedCount}`;
  console.log(summary);
  logToFile(summary);
  logToFile(''); // пустая строка-разделитель
*/
  return fired;
      }

module.exports = {
  checkComboStrategies
};
