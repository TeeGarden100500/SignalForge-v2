const { getTopVolatilePairs } = require('./volatilitySelector');
const { VOLATILITY_UPDATE_INTERVAL_HOURS } = require('./config');

async function runVolatilityScanLoop() {
  await getTopVolatilePairs(); // первый запуск сразу

  const intervalMs = VOLATILITY_UPDATE_INTERVAL_HOURS * 60 * 60 * 1000;
  setInterval(async () => {
    console.log(`\n🔁 Обновление списка волатильных пар...`);
    await getTopVolatilePairs();
  }, intervalMs);
}

runVolatilityScanLoop();
