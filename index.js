// 🚀 index.js — Точка входа в систему SignalForge v2

const config = require('./config/config');
const { selectTopVolatileSymbols } = require('./ws/volatilitySelector');
const { connectToStreams } = require('./ws/smartWSManager');
const logger = require('./utils/logger');

// 🔁 Цикл обновления волатильных монет
async function startBot() {
  logger.basic('🚀 Запуск SignalForge v2...');

  async function updateAndSubscribe() {
    try {
      const topSymbols = await selectTopVolatileSymbols();
      logger.basic(`[volatility] Топ-${topSymbols.length} монет: ${topSymbols.join(', ')}`);

      // Подключение к WebSocket с топ-символами
      connectToStreams(topSymbols);
    } catch (err) {
      logger.error('[volatility] Ошибка при получении волатильных монет:', err.message);
    }
  }

  // Первый запуск сразу
  await updateAndSubscribe();

  // Периодическое обновление по таймеру
  setInterval(updateAndSubscribe, config.VOLATILITY_REFRESH_INTERVAL_SEC * 1000);
}

startBot();
