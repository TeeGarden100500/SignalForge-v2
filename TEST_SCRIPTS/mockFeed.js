const mockData = require('./testData/mock_candles_converted.json');
const { checkRSIStrategy } = require('../core/strategyRSI');
const { checkMACDStrategy } = require('../core/strategyMACD');
const { checkVolumeSpikeStrategy } = require('../core/strategyVolumeSpike');

console.log(`📥 Запуск мок-тестов по всем доступным парам...\n`);

Object.entries(mockData).forEach(([key, candles]) => {
  if (!Array.isArray(candles) || candles.length === 0) {
    console.warn(`⚠️ Пропущено: ${key} — данные отсутствуют`);
    return;
  }

  const [symbol, interval] = key.split('_');

  console.log(`\n🧪 Проверка: ${symbol} [${interval}] (свечей: ${candles.length})`);

  const rsiResult = checkRSIStrategy(symbol, candles);
  if (rsiResult) {
    console.log(`📢 RSI Сигнал: ${rsiResult.message}`);
  } else {
    console.log(`ℹ️ RSI: нет сигнала`);
  }

  const macdResult = checkMACDStrategy(symbol, candles, interval);
  if (macdResult) {
    console.log(`📢 MACD Сигнал: ${macdResult.message}`);
  } else {
    console.log(`ℹ️ MACD: нет сигнала`);
  }

  const volumeResult = checkVolumeSpikeStrategy(symbol, candles, interval);
  if (volumeResult) {
    console.log(`📢 VOLUME SPIKE: ${volumeResult.message}`);
  } else {
    console.log(`ℹ️ Volume Spike: нет сигнала`);
  }
});
