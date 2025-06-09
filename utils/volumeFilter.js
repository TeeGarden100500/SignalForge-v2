const { DEBUG_LOG_LEVEL, VOLUME_FILTER } = require('../config');
const { pruneObsoleteSymbols } = require('./pruneCache');
const { verboseLog } = require('./logger');

function calcRecentVolumeUSD(candles = [], count = 5) {
  if (!Array.isArray(candles) || candles.length === 0) return 0;
  return candles.slice(-count).reduce((sum, c) => sum + c.volume * c.close, 0);
}

function filterSymbolsByVolume(symbols = [], candleCache) {
  if (!VOLUME_FILTER?.ENABLED) return symbols;

  const removed = [];
  const filtered = symbols.filter(p => {
    const candles = candleCache?.[p.symbol]?.['5m'] || [];
    const volumeUSD = calcRecentVolumeUSD(candles, 5);
    if (volumeUSD < VOLUME_FILTER.MIN_VOLUME_5M_USD) {
      removed.push({ symbol: p.symbol, volumeUSD });
      return false;
    }
    return true;
  });

  if (DEBUG_LOG_LEVEL === 'verbose') {
    removed.forEach(r => {
      const vol = r.volumeUSD.toLocaleString(undefined, { maximumFractionDigits: 0 });
      verboseLog(`[INFO] Пропуск ${r.symbol} — объём $${vol} за 5 минут ниже порога $${VOLUME_FILTER.MIN_VOLUME_5M_USD}`);
    });
  }

  if (candleCache) {
    const filteredSymbols = filtered.map(p => p.symbol);
    pruneObsoleteSymbols(candleCache, filteredSymbols);
  }

  return filtered;
}

module.exports = {
  calcRecentVolumeUSD,
  filterSymbolsByVolume,
};
