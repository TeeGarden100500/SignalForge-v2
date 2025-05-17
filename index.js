// index.js — запуск SignalForge v2 с диагностикой

const { startVolatilityLoop, onReady } = require('./ws/volatilitySelector');
const { connectToStreams } = require('./ws/smartWSManager');
const logger = require('./utils/logger');

function startBot() {
  logger.basic('🚀 Запуск SignalForge v2...');

  startVolatilityLoop((topSymbols) => {
  logger.basic(`[index] 🔁 onReady сработал. Символы из волатильности: ${topSymbols?.join(', ')}`);
  
  const debugList = ['BTCUSDT'];
  logger.basic(`[index] 🔁 Принудительная подписка на: ${debugList}`);
  connectToStreams(debugList);
});

}

startBot();
startVolatilityLoop();
