const { applyStrategies } = require('../core/applyStrategies');
const { checkComboStrategies } = require('../core/checkCombo');
 /* const mock1 = require('./testData/mock_candles_converted.json');
 const mock2 = require('./testData/mock_atr_spike.json');
 const mock3 = require('./testData/mock_adx_trend_flat.json');
 const mock4 = require('./testData/mock_fibo_touch.json');
 const mock5 = require('./testData/mock_combo_momentum.json');
 const mock6 = require('./testData/mock_ema_debug.json');
 const mock7 = require('./testData/mock_bullish_divergence (2).json');
 const mock8 = require('./testData/mock_dead_volume_fall.json');
 const mock9 = require('./testData/mock_exhaustion_top (2).json'); */
 const mock10 = require('./testData/mock_EMA_test_60_candles.json');
 const mock11 = require('./testData/mock_EMA_test.json');


const mockData = {
 /*  ...mock1,
  ...mock2,
  ...mock3,
  ...mock4,
  ...mock5,
  ...mock6,
  ...mock7,
  ...mock8,
  ...mock9, */
  ...mock10,
  ...mock11, 
};

Object.entries(mockData).forEach(([key, candles]) => {
  const [symbol, interval] = key.split('_');
  console.log(`\n🧪 Проверка: ${symbol} [${interval}]`);

  const { signalTags, messages } = applyStrategies(symbol, candles, interval);
  messages.forEach(msg => console.log(`📢 ${msg}`));

  const combos = checkComboStrategies(symbol, signalTags, interval, candles);
  console.log('📌 COMBO TAGS:', signalTags);
  combos.forEach(c => {
    console.log(c.message);
  });
});
