const { updateVolatilityRanking } = require('./ws/volatilitySelector');
const { DEBUG_LOG_LEVEL } = require('./config');
const logger = require('./core/logger');

function startBot() {
  logger.info('[index] 🛰️ Запуск SignalForge v2...');
  logger.info('[index] ☑️ Ожидание готовности волатильности (onReady)...');

  // Запускаем расчёт каждые 60 секунд
  setInterval(updateVolatilityRanking, 60000);
}

startBot();
