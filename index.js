console.log(`🚀 [BOOT] Старт SignalForge @ ${new Date().toISOString()}`);
const { getTopVolatilePairs } = require('./volatilitySelector');
const { loadFuturesSymbols } = require('./futuresSymbols');
const { VOLATILITY_UPDATE_INTERVAL_HOURS } = require('./config');
const { startCandleCollector, candleCache } = require('./wsHandler');
const { analyzeAllSymbols } = require('./startAnalysisCycle');

async function runVolatilityScanLoop() {
  const intervalMs = VOLATILITY_UPDATE_INTERVAL_HOURS * 60 * 60 * 1000;
  setInterval(async () => {
    console.log(`\n🔁 Обновление списка волатильных пар...`);
    await loadFuturesSymbols(candleCache);
    await getTopVolatilePairs(candleCache);
  }, intervalMs);
}

(async () => {
  await loadFuturesSymbols(candleCache);
  const topPairs = await getTopVolatilePairs(candleCache);
  await startCandleCollector(topPairs);

  const timeframes = ['5m', '15m', '1h'];

  timeframes.forEach((tf, i) => {
    setTimeout(() => {
      analyzeAllSymbols(topPairs.map(p => p.symbol || p), tf);
    }, i * 30000); // 30 секунд между фреймами
  });
})();

runVolatilityScanLoop();
