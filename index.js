const { startVolatilityLoop, onReady } = require('./ws/volatilitySelector');
const { connectToStreams } = require('./ws/smartWSManager');
const logger = require('./utils/logger');

logger.logInfo('🚀 Запуск SignalForge v2...');
startVolatilityLoop();

onReady((topSymbols) => {
  if (!topSymbols || topSymbols.length === 0) {
    logger.logError('[index] ❌ Топ монет пуст. Возможно, кэш ещё не заполнен.');
    return;
  }

  logger.logInfo(`[index] ✅ Монеты для подписки: ${topSymbols.join(', ')}`);
  connectToStreams(topSymbols);
});
