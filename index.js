const { getTopVolatilePairs } = require('./volatilitySelector');
const { VOLATILITY_UPDATE_INTERVAL_HOURS } = require('./config');
const { startCandleCollector } = require('./wsHandler');

async function runVolatilityScanLoop() {
  const intervalMs = VOLATILITY_UPDATE_INTERVAL_HOURS * 60 * 60 * 1000;
  setInterval(async () => {
    console.log(`\n🔁 Обновление списка волатильных пар...`);
    await getTopVolatilePairs();
  }, intervalMs);
}
(async () => {
  const topPairs = await getTopVolatilePairs();
  startCandleCollector(topPairs);
})();
runVolatilityScanLoop();
