const mock1 = require('./testData/mock_candles_converted.json');
const mock2 = require('./testData/mock_atr_spike.json');
const mock3 = require('./testData/mock_adx_trend_flat.json');
const mock4 = require('./testData/mock_fibo_touch.json');
const mock5 = require('./testData/mock_combo_momentum.json');


const mockData = {
  ...mock1,
  ...mock2,
  ...mock3,
  ...mock4,
  ...mock5,
};


const { checkRSIStrategy } = require('../core/strategyRSI');
const { checkMACDStrategy } = require('../core/strategyMACD');
const { checkVolumeSpikeStrategy } = require('../core/strategyVolumeSpike');
const { checkEMACrossoverStrategy } = require('../core/strategyEMA');
const { checkEMAAngleStrategy } = require('../core/strategyEMA');
const { checkBreakoutStrategy } = require('../core/strategyBreakout');
const { checkHighLowProximity } = require('../core/strategyHighLow');
const { checkMeanReversionStrategy } = require('../core/strategyMeanReversion');
const { checkATRSpikeStrategy } = require('../core/strategyATR');
const { checkADXStrengthStrategy } = require('../core/strategyADX');
const { checkFiboProximityStrategy } = require('../core/strategyFibo');
const { checkComboStrategies } = require('../core/checkCombo');

console.log(`📥 Запуск мок-тестов по всем доступным парам...\n`);

const signalTags = [];

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
    signalTags.push(rsiResult.tag);  //******************************************
  } else {
    console.log(`ℹ️ RSI: нет сигнала`);
  }

const macdResult = checkMACDStrategy(symbol, candles, interval);
  if (macdResult) {
    console.log(`📢 MACD Сигнал: ${macdResult.message}`);
    signalTags.push(macdResult.tag); //******************************************
  } else {
    console.log(`ℹ️ MACD: нет сигнала`);
  }

const volumeResult = checkVolumeSpikeStrategy(symbol, candles, interval);
  if (volumeResult) {
    console.log(`📢 VOLUME SPIKE: ${volumeResult.message}`);
              signalTags.push("VOLUME_SPIKE"); //************************************
  } else {
    console.log(`ℹ️ Volume Spike: нет сигнала`);
  }

const emaResult = checkEMACrossoverStrategy(symbol, candles, interval);
if (emaResult) {
  console.log(`📢 EMA CROSSOVER: ${emaResult.message}`);
  signalTags.push(emaCross.tag); //****************************************
} else {
  console.log(`ℹ️ EMA: нет сигнала`);
}

const emaAngle = checkEMAAngleStrategy(symbol, candles, interval);
if (emaAngle) {
  console.log(`📢 EMA ANGLE: ${emaAngle.message}`);
  signalTags.push(emaResult.tag); //*****************************************
} else {
  console.log(`ℹ️ EMA угол: нет сигнала`);
}
  const breakout = checkBreakoutStrategy(symbol, candles, interval);
if (breakout) {
  console.log(`📢 BREAKOUT: ${breakout.message}`);
  signalTags.push("BREAKOUT"); //************************************************
} else {
  console.log(`ℹ️ Breakout: нет сигнала`);
}
  const { checkHighLowProximity } = require('../core/strategyHighLow');

// Строгая чувствительность
const proximityStrict = checkHighLowProximity(symbol, candles, interval, 'strict');
if (proximityStrict) {
  console.log(`📢 High/Low Proximity: ${proximityStrict.message}`);
  signalTags.push(proximityStrict.tag);  // ********************************************
} else {
  console.log(`ℹ️ High/Low: нет сигнала [strict]`);
}

// Расширенная чувствительность
const proximityLoose = checkHighLowProximity(symbol, candles, interval, 'loose');
if (proximityLoose) {
  console.log(`📢 High/Low Proximity (loose): ${proximityLoose.message}`);
  signalTags.push(proximityLoose.tag); //******************************************
} else {
  console.log(`ℹ️ High/Low: нет сигнала [loose]`);
}

const meanRev = checkMeanReversionStrategy(symbol, candles, interval);
if (meanRev) {
  console.log(`📢 Mean Reversion: ${meanRev.message}`);
  signalTags.push(meanRev.tag); //*************************************************
} else {
  console.log(`ℹ️ Mean Rev: нет сигнала`);
}

const atrSpike = checkATRSpikeStrategy(symbol, candles, interval);
if (atrSpike) {
  console.log(`📢 ATR: ${atrSpike.message}`);
  signalTags.push("ATR_SPIKE"); //*************************************************
} else {
  console.log(`ℹ️ ATR: нет сигнала`);
}

const adxSignal = checkADXStrengthStrategy(symbol, candles, interval);
if (adxSignal) {
  console.log(`📢 ADX: ${adxSignal.message}`);
  signalTags.push(adxSignal.tag); //***********************************************
} else {
  console.log(`ℹ️ ADX: нет сигнала`);
}

const fiboSignal = checkFiboProximityStrategy(symbol, candles, interval);
if (fiboSignal) {
  console.log(`📢 FIBO: ${fiboSignal.message}`);
  signalTags.push("FIBO_TOUCH"); //***********************************************
} else {
  console.log(`ℹ️ FIBO: нет сигнала`);
}

const combos = checkComboStrategies(symbol, signalTags);
combos.forEach(c => {
  console.log(`🔗 COMBO: ${c.message}`);
  });

});
