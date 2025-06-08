const { comboStrategies } = require('./comboStrategies');

// 👉 Заменяй этот список на любые теги, которые хочешь протестировать
const simulatedTags = [
  'RSI_OVERBOUGHT',
  'EMA_ANGLE',
  'VOLUME_SPIKE',
  'BREAKOUT',
  'ADX_TREND',
  'DOJI',
  'RSI_HIDDEN_BULL',
  'MACD_DIVERGENCE',
  'MEAN_REVERS_UP',
  'VOLUME_DROP',
  'RSI_DROP'
];

function comboTestRun(tags = simulatedTags) {
  console.log(`\n🧪 [COMBO TEST] Проверка стратегий по тегам:\n`, tags, '\n');

  let fired = 0;

  for (const combo of comboStrategies) {
    const allMatch = combo.conditions.every(tag => tags.includes(tag));
    if (allMatch) {
      console.log(`✅ COMBO сработала: [${combo.name}]`);
      console.log(`${combo.message('TEST', '1h')}\n`);
      fired++;
    } else {
      console.log(`— ❌ [${combo.name}] — условия не совпали`);
    }
  }

  if (fired === 0) {
    console.log(`⚠️ Ни одна COMBO не сработала. Попробуй изменить список тегов.\n`);
  }
}

// Автозапуск
comboTestRun();
