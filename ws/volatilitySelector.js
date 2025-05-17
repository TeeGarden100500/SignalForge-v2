// ws/volatilitySelector.js — отбор топ-волатильных монет по локальному кэшу (с флагом ready)

const config = require('../config/config');
const { cache } = require('../logic/multiCandleCache');
const logger = require('../utils/logger');

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
  const tf = config.TIMEFRAMES.LEVEL_1;
  const requiredCandles = config.VOLATILITY_LOOKBACK / 5;
  const results = [];

  for (const symbol in cache) {
    const candles = cache[symbol]?.[tf];
    if (!candles || candles.length < requiredCandles) continue;

    const recentCandles = candles.slice(-requiredCandles);
    const vol = calculateVolatility(recentCandles);
    results.push({ symbol, volatility: vol });
  }

  if (results.length === 0) {
    logger.error('[volatility] Ошибка при получении волатильных монет: недостаточно данных');
    return;
  }

  results.sort((a, b) => b.volatility - a.volatility);
  topVolatileSymbols = results.slice(0, config.VOLATILITY_TOP_N).map(r => r.symbol);
  ready = true;

  logger.info(`[volatility] Топ-${config.VOLATILITY_TOP_N} монет: ${topVolatileSymbols.join(', ')}`);

  // Вызов отложенных подписок
  onReadyCallbacks.forEach(fn => {
    try {
      fn(topVolatileSymbols);
    } catch (err) {
      logger.error('[volatility] Ошибка в onReady callback:', err.message);
    }
  });
  onReadyCallbacks = [];
}

function getTopVolatileSymbols() {
  if (!ready) throw new Error('Volatility data not ready yet.');
  return topVolatileSymbols;
}

function startVolatilityLoop() {
  setTimeout(() => {
    updateVolatilityRanking();
    setInterval(updateVolatilityRanking, config.VOLATILITY_REFRESH_INTERVAL_SEC * 1000);
  }, config.VOLATILITY_LOOKBACK * 60 * 1000);
}

function onReady(callback) {
  if (ready) {
    callback(topVolatileSymbols);
  } else {
    onReadyCallbacks.push(callback);
  }
}

module.exports = {
  getTopVolatileSymbols,
  startVolatilityLoop,
  onReady
};
