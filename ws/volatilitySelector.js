// ws/volatilitySelector.js — отбор топ-волатильных монет по локальному кэшу

const config = require('../config/config');
const { cache } = require('../logic/multiCandleCache');
const logger = require('../utils/logger');

let topVolatileSymbols = [];

function calculateVolatility(candles) {
  const highs = candles.map(c => parseFloat(c.high));
  const lows = candles.map(c => parseFloat(c.low));

  const maxHigh = Math.max(...highs);
  const minLow = Math.min(...lows);

  return ((maxHigh - minLow) / minLow) * 100;
}

function updateVolatilityRanking() {
  const tf = config.TIMEFRAMES.LEVEL_1; // допустим, '5m'
  const requiredCandles = config.VOLATILITY_LOOKBACK / 5;

  const results = [];

  for (const symbol in cache) {
    const candles = cache[symbol]?.[tf];
    if (!candles || candles.length < requiredCandles) continue;

    const recentCandles = candles.slice(-requiredCandles);
    const vol = calculateVolatility(recentCandles);

    results.push({ symbol, volatility: vol });
  }

  results.sort((a, b) => b.volatility - a.volatility);
  topVolatileSymbols = results.slice(0, config.VOLATILITY_TOP_N).map(r => r.symbol);

  logger.info(`[volatility] Топ-${config.VOLATILITY_TOP_N} монет: ${topVolatileSymbols.join(', ')}`);
}

function startVolatilityLoop() {
  setTimeout(() => {
    updateVolatilityRanking(); // первый запуск
    setInterval(updateVolatilityRanking, config.VOLATILITY_REFRESH_INTERVAL_SEC * 1000);
  }, config.VOLATILITY_LOOKBACK * 60 * 1000); // старт после накопления

  function getTopVolatileSymbols() {
  return topVolatileSymbols;
}
}

module.exports = {
  startVolatilityLoop,
  getTopVolatileSymbols,
};
