const { applyStrategies } = require('../core/applyStrategies');
const { checkComboStrategies } = require('../core/checkCombo');
const mock1 = require('./testData/mock_candles_converted.json');
const mock2 = require('./testData/mock_atr_spike.json');
const mock3 = require('./testData/mock_adx_trend_flat.json');
const mock4 = require('./testData/mock_fibo_touch.json');
const mock5 = require('./testData/mock_combo_momentum.json');
const mock6 = require('./testData/mock_ema_debug.json');

const mockData = {
  ...mock1,
  ...mock2,
  ...mock3,
  ...mock4,
  ...mock5,
  ...mock6,  
};



Object.entries(mockData).forEach(([key, candles]) => {
  const [symbol, interval] = key.split('_');
  console.log(`\n🧪 Проверка: ${symbol} [${interval}]`);

  const { signalTags, messages } = applyStrategies(symbol, candles, interval);
  messages.forEach(msg => console.log(`📢 ${msg}`));

  const combos = checkComboStrategies(symbol, signalTags);
  console.log('📌 COMBO TAGS:', signalTags);
  combos.forEach(c => {
    console.log(`🔗 COMBO: ${c.message}`);
  });
});
