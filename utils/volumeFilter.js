const { DEBUG_LOG_LEVEL, VOLUME_FILTER } = require('../config');
const { pruneObsoleteSymbols } = require('./pruneCache');
const { verboseLog } = require('./logger');

function calcRecentVolumeUSD(candles = [], count = 1) {
  if (!Array.isArray(candles) || candles.length === 0) return 0;
  return candles.slice(-count).reduce((sum, c) => sum + c.volume * c.close, 0);
}

function filterSymbolsByVolume(symbols = [], candleCache) {
  if (!VOLUME_FILTER?.ENABLED) return symbols;

  const removed = [];
  const filtered = symbols.filter(p => {
    const symbol = p.symbol || p;
    const candles = candleCache?.[symbol]?.['5m'] || [];
    const candle = candles.at(-1);

    if (!candle || !candle.volume || !candle.close || isNaN(candle.volume) || isNaN(candle.close)) {
      console.warn(`[WARN] Пропуск ${symbol} — нет актуальной свечи или данных`);
      removed.push({ symbol, reason: 'nodata' });
      return false;
    }

    const volumeUSD = candle.volume * candle.close;

    if (DEBUG_LOG_LEVEL === 'verbose') {
      console.log(`[DEBUG] Объём по ${symbol}: ${candle.volume} * ${candle.close} = ${volumeUSD}`);
    }

    if (volumeUSD < VOLUME_FILTER.MIN_VOLUME_5M_USD) {
      removed.push({ symbol, volumeUSD });
      return false;
    }
    return true;
  });

  if (DEBUG_LOG_LEVEL === 'verbose') {
    removed.forEach(r => {
      if (r.reason === 'nodata') return;
      const vol = r.volumeUSD.toLocaleString(undefined, { maximumFractionDigits: 0 });
      verboseLog(`[INFO] Пропуск ${r.symbol} — объём $${vol} за 5 минут ниже порога $${VOLUME_FILTER.MIN_VOLUME_5M_USD}`);
    });
  }

  const belowThreshold = removed.filter(r => !r.reason).length;
  if (belowThreshold > 0 && DEBUG_LOG_LEVEL !== 'none') {
    console.log(`[INFO] По объёму ниже порога исключено ${belowThreshold} символов`);
  }

  if (candleCache) {
    const filteredSymbols = filtered.map(p => p.symbol);
    if (filteredSymbols.length > 0) {
      pruneObsoleteSymbols(candleCache, filteredSymbols);
    }
  }

  return filtered;
}

module.exports = {
  calcRecentVolumeUSD,
  filterSymbolsByVolume,
};
