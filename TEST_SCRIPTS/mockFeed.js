const { applyStrategies } = require('../core/applyStrategies');

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
