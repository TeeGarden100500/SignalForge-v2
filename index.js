// index.js — запуск SignalForge v2 с диагностикой

const { startVolatilityLoop, onReady } = require('./ws/volatilitySelector');
const { connectToStreams } = require('./ws/smartWSManager');
const logger = require('./utils/logger');

function startBot() {
  logger.basic('🚀 Запуск SignalForge v2...');

  // запускаем сбор волатильности
  startVolatilityLoop();

  logger.basic('[index] ⏳ Ожидание готовности волатильности (onReady)...');

  onReady((topSymbols) => {
    if (!Array.isArray(topSymbols) || topSymbols.length === 0) {
      logger.error('[index] ❌ Получен пустой список монет.');
      return;
    }

    logger.basic(`[index] ✅ Готовность достигнута. Топ монет: ${topSymbols.join(', ')}`);

    try {
      connectToStreams(topSymbols);
    } catch (streamErr) {
      logger.error('[index] ❌ Ошибка при запуске WebSocket-потоков:', streamErr?.message || streamErr);
    }
  });
}

startBot();
