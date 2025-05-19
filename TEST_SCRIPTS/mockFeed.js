const mockData = require('./testData/mock_candles_converted.json');
const { checkRSIStrategy } = require('../core/strategyRSI');
const { checkMACDStrategy } = require('../core/strategyMACD');
const { checkVolumeSpikeStrategy } = require('../core/strategyVolumeSpike');
const { checkEMACrossoverStrategy } = require('../core/strategyEMA');
const { checkEMAAngleStrategy } = require('../core/strategyEMA');
const { checkBreakoutStrategy } = require('../core/strategyBreakout');
const { checkHighLowProximity } = require('../core/strategyHighLow');
const { checkMeanReversionStrategy } = require('../core/strategyMeanReversion');

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

const emaResult = checkEMACrossoverStrategy(symbol, candles, interval);
if (emaResult) {
  console.log(`📢 EMA CROSSOVER: ${emaResult.message}`);
} else {
  console.log(`ℹ️ EMA: нет сигнала`);
}

const emaAngle = checkEMAAngleStrategy(symbol, candles, interval);
if (emaAngle) {
  console.log(`📢 EMA ANGLE: ${emaAngle.message}`);
} else {
  console.log(`ℹ️ EMA угол: нет сигнала`);
}
  const breakout = checkBreakoutStrategy(symbol, candles, interval);
if (breakout) {
  console.log(`📢 BREAKOUT: ${breakout.message}`);
} else {
  console.log(`ℹ️ Breakout: нет сигнала`);
}
  const { checkHighLowProximity } = require('../core/strategyHighLow');

// Строгая чувствительность
const proximityStrict = checkHighLowProximity(symbol, candles, interval, 'strict');
if (proximityStrict) {
  console.log(`📢 High/Low Proximity: ${proximityStrict.message}`);
} else {
  console.log(`ℹ️ High/Low: нет сигнала [strict]`);
}

// Расширенная чувствительность
const proximityLoose = checkHighLowProximity(symbol, candles, interval, 'loose');
if (proximityLoose) {
  console.log(`📢 High/Low Proximity (loose): ${proximityLoose.message}`);
} else {
  console.log(`ℹ️ High/Low: нет сигнала [loose]`);
}

const meanRev = checkMeanReversionStrategy(symbol, candles, interval);
if (meanRev) {
  console.log(`📢 Mean Reversion: ${meanRev.message}`);
} else {
  console.log(`ℹ️ Mean Rev: нет сигнала`);
}
  
});
