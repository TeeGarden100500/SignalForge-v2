// index.js
const { DEBUG_LOG_LEVEL, INTERVAL, ENABLE_WEBHOOK } = require('./config/config');
const { selectTopVolatileSymbols } = require('./ws/volatilitySelector');
const { setupSymbolSubscriptions } = require('./ws/smartWSManager');
const { logInfo } = require('./utils/logger');

(async () => {
  logInfo('Запуск SignalForge v2...');

  const topSymbols = await selectTopVolatileSymbols();
  logInfo(`Выбраны монеты: ${topSymbols.join(', ')}`);

  setupSymbolSubscriptions(topSymbols);
})();
