const fs = require('fs');
const path = require('path');
const { comboStrategies } = require('../comboStrategies');
const { DEBUG_LOG_LEVEL } = require('../config');

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
  let firedCount = 0;

  for (const combo of comboStrategies) {
    const matches = combo.conditions.filter(cond => signals.includes(cond));
    const minMatch = combo.minMatch || combo.conditions.length;

    if (matches.length >= minMatch) {
      firedCount++;

      const msg = typeof combo.message === 'function'
        ? combo.message(symbol, timeframe)
        : combo.message;

      if (DEBUG_LOG_LEVEL !== 'none') {
        const logLine = `✅ COMBO "${combo.name}" сработала для ${symbol} [${timeframe}]: ${msg}`;
        console.log(logLine);
        logToFile(logLine);
      }

      fired.push({
        symbol,
        timeframe,
        name: combo.name,
        message: msg,
        direction: combo.direction
      });
    } else if (DEBUG_LOG_LEVEL === 'verbose') {
      const missing = combo.conditions.filter(cond => !signals.includes(cond));
      const msg = `❌ COMBO "${combo.name}" НЕ сработала для ${symbol}: не хватает тегов: ${missing.join(', ')} (${matches.length}/${minMatch})`;
      console.log(msg);
      logToFile(msg);
    }
  }

  if (DEBUG_LOG_LEVEL !== 'none') {
    const summary = `📊 Проверено COMBO стратегий: ${comboStrategies.length} | Сработало: ${firedCount}`;
    console.log(summary);
    logToFile(summary);
    logToFile('');
  }

  return fired;
}

module.exports = {
  checkComboStrategies
};
