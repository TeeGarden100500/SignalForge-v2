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
  const debugList = ['BTCUSDT'];
  connectToStreams(debugList);
});
}

startBot();
