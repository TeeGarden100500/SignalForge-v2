const { startVolatilityLoop, onReady } = require('./ws/volatilitySelector');
const { connectToStreams } = require('./ws/smartWSManager');
const logger = require('./utils/logger');

logger.logInfo('🚀 Запуск SignalForge...');

startVolatilityLoop();

onReady((topSymbols) => {
    if (!topSymbols || topSymbols.length === 0) {
        logger.logError('[index] ❌ Топ монет пуст. Возможно, нет данных в кэше.');
        return;
    }

    logger.logInfo(`[index] ✅ Получены монеты: ${topSymbols.join(', ')}`);
    connectToStreams(topSymbols);
});
