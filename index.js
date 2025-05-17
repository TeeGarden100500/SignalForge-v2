// index.js — Точка запуска SignalForge v2

const { startVolatilityLoop, onReady } = require('./ws/volatilitySelector');
const { connectToStreams } = require('./ws/smartWSManager');
const logger = require('./utils/logger');

function startBot() {
  logger.basic('🚀 Запуск SignalForge v2...');

  // запускаем сбор волатильности
  startVolatilityLoop();

  // ждём, пока будет готов топ волатильных монет
  onReady((topSymbols) => {
    if (!Array.isArray(topSymbols) || topSymbols.length === 0) {
      logger.error('[volatility] Получен пустой список монет.');
      return;
    }

    logger.basic(`[volatility] Топ-${topSymbols.length} монет: ${topSymbols.join(', ')}`);

    try {
      connectToStreams(topSymbols);
    } catch (streamErr) {
      logger.error('[streams] Ошибка при запуске WebSocket-потоков:', streamErr?.message || streamErr);
    }
  });
}

startBot();
