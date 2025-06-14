console.log(`🚀 [BOOT] Старт SignalForge @ ${new Date().toISOString()}`);
const { getTopVolatilePairs } = require('./volatilitySelector');
const { loadFuturesSymbols } = require('./futuresSymbols');
const { VOLATILITY_UPDATE_INTERVAL_HOURS } = require('./config');
const { startCandleCollector, candleCache, candlesReceived } = require('./wsHandler');
const { analyzeAllSymbols } = require('./startAnalysisCycle');
const { filterSymbolsByVolume } = require('./utils/volumeFilter');
const { waitForCandles } = require('./utils/waitForCandles');

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
  let topPairs = await getTopVolatilePairs(candleCache, true);
  await startCandleCollector(topPairs);

  const symbols = topPairs.map(p => p.symbol || p);
  await waitForCandles(candlesReceived, symbols, '5m');

  topPairs = filterSymbolsByVolume(topPairs, candleCache);

  const timeframes = ['5m', '15m', '1h'];

  timeframes.forEach((tf, i) => {
    setTimeout(() => {
      analyzeAllSymbols(topPairs.map(p => p.symbol || p), tf);
    }, i * 30000); // 30 секунд между фреймами
  });
})();

runVolatilityScanLoop();
