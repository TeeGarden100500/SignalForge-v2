const config = require('../config/config');
const { logInfo, logVerbose, logError } = require('../utils/logger');
const { cache } = require('../logic/multiCandleCache');

let topVolatileSymbols = [];
let ready = false;
let onReadyCallbacks = [];

function calculateVolatility(candles) {
  const highs = candles.map(c => parseFloat(c.high));
  const lows = candles.map(c => parseFloat(c.low));
  const maxHigh = Math.max(...highs);
  const minLow = Math.min(...lows);
  return ((maxHigh - minLow) / minLow) * 100;
}

function updateVolatilityRanking() {
  try {
    const tf = config.TIMEFRAMES.LEVEL_1;
    const required = config.VOLATILITY_LOOKBACK / 5;
    const scores = [];

    for (const symbol in cache) {
      const candles = cache[symbol]?.[tf];
      const count = candles?.length || 0;

      logInfo(`[volatility] ${symbol} [${tf}] — ${count} свечей в кэше`);

      if (!candles || candles.length < required) continue;

      const recent = candles.slice(-required);
      const vol = calculateVolatility(recent);
      scores.push({ symbol, volatility: vol });
    }

    if (scores.length === 0) {
      logError('[volatility] ❌ Недостаточно данных. Перезапуск в следующем цикле...');
      return;
    }

    scores.sort((a, b) => b.volatility - a.volatility);
    topVolatileSymbols = scores.slice(0, config.VOLATILITY_TOP_N).map(s => s.symbol);
    ready = true;

    logInfo(`[volatility] ✅ Топ-${config.VOLATILITY_TOP_N}: ${topVolatileSymbols.join(', ')}`);

    onReadyCallbacks.forEach(cb => {
      try {
        cb(topVolatileSymbols);
      } catch (e) {
        logError(`[volatility] ❌ Ошибка в callback: ${e.message}`);
      }
    });

    onReadyCallbacks = [];

  } catch (err) {
    logError(`[volatility] ❌ Ошибка updateVolatilityRanking: ${err.message}`);
  }
}

function startVolatilityLoop() {
  updateVolatilityRanking();
  setInterval(updateVolatilityRanking, config.VOLATILITY_REFRESH_INTERVAL_SEC * 1000);
}

function onReady(callback) {
  if (ready) {
    callback(topVolatileSymbols);
  } else {
    onReadyCallbacks.push(callback);
  }
}

module.exports = {
  startVolatilityLoop,
  onReady,
  getTopVolatileSymbols: () => topVolatileSymbols
};
