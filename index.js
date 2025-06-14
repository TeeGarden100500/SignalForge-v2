console.log(`🚀 [BOOT] Старт SignalForge @ ${new Date().toISOString()}`);
const { getTopVolatilePairs } = require('./volatilitySelector');
const { loadFuturesSymbols } = require('./futuresSymbols');
const { VOLATILITY_UPDATE_INTERVAL_HOURS, MIN_READY_SYMBOLS, DEBUG_LOG_LEVEL } = require('./config');
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
  const readySymbols = await waitForCandles(candlesReceived, symbols, '5m');

  if (readySymbols.length < MIN_READY_SYMBOLS) {
    console.error(`[ERROR] Недостаточно готовых пар: ${readySymbols.length}. Отбор отменён.`);
    if (DEBUG_LOG_LEVEL === 'verbose' && readySymbols.length > 0) {
      console.error(`[DEBUG] Готовые пары: ${readySymbols.join(', ')}`);
    }
    return;
  }

  console.log('🔁 Отбор начат...');
  topPairs = topPairs.filter(p => readySymbols.includes(p.symbol || p));
  topPairs = filterSymbolsByVolume(topPairs, candleCache);

  const timeframes = ['5m', '15m', '1h'];

  timeframes.forEach((tf, i) => {
    setTimeout(() => {
      analyzeAllSymbols(topPairs.map(p => p.symbol || p), tf);
    }, i * 30000); // 30 секунд между фреймами
  });
})();

runVolatilityScanLoop();
