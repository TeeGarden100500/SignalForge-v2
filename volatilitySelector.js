const axios = require('axios');
const { TOP_N_PAIRS, DEBUG_LOG_LEVEL, VOLUME_FILTER } = require('./config');
const { pruneObsoleteSymbols } = require('./utils/pruneCache');
const { loadFuturesSymbols, hasFuturesData, getFuturesSymbols } = require('./futuresSymbols');
const { verboseLog, basicLog } = require('./utils/logger');
const { filterSymbolsByVolume } = require('./utils/volumeFilter');

async function getTopVolatilePairs(candleCache) {
  try {
    if (!hasFuturesData()) await loadFuturesSymbols(candleCache);

    const url = 'https://api.binance.com/api/v3/ticker/24hr';
    const response = await axios.get(url);

    const futuresSet = new Set(getFuturesSymbols());

    let pairs = response.data
      .filter(p => futuresSet.has(p.symbol))
      .filter(p => !p.symbol.includes('UP') && !p.symbol.includes('DOWN'))
      .map(pair => {
        const high = parseFloat(pair.highPrice);
        const low = parseFloat(pair.lowPrice);

        if (!low || !high || isNaN(low) || isNaN(high) || low === 0) return null;

        const volatility = ((high - low) / low) * 100;

        return {
          symbol: pair.symbol,
          volatility: +volatility.toFixed(2),
        };
      })
      .filter(Boolean);

    if (VOLUME_FILTER?.ENABLED) {
      pairs = filterSymbolsByVolume(pairs, candleCache);
      basicLog(`[INFO] Фильтрация по объёму $${VOLUME_FILTER.MIN_VOLUME_5M_USD} → осталось ${pairs.length} пар`);
    }

    pairs.sort((a, b) => b.volatility - a.volatility);

    const topSymbols = pairs.slice(0, TOP_N_PAIRS);

    if (DEBUG_LOG_LEVEL !== 'none') {
      basicLog(`[INFO] Отобрано ${topSymbols.length} самых волатильных`);
      basicLog(`📊 Топ ${topSymbols.length} волатильных пар:`);
      topSymbols.forEach(p => basicLog(`${p.symbol}: ${p.volatility}%`));
    }

    const topVolatileSymbols = topSymbols.map(p => p.symbol);

    if (typeof candleCache !== 'undefined') {
      pruneObsoleteSymbols(candleCache, topVolatileSymbols);
    }

    return topSymbols;
  } catch (err) {
    console.error('❌ Ошибка при расчёте волатильности:', err.message);
    return [];
  }
}

module.exports = {
  getTopVolatilePairs,
};
