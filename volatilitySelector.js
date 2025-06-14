const axios = require('axios');
const { TOP_N_PAIRS, DEBUG_LOG_LEVEL, VOLUME_FILTER } = require('./config');
const { pruneObsoleteSymbols } = require('./utils/pruneCache');
const { loadFuturesSymbols, hasFuturesData, getFuturesSymbols } = require('./futuresSymbols');
const { verboseLog, basicLog } = require('./utils/logger');
const { filterSymbolsByVolume } = require('./utils/volumeFilter');

async function getTopVolatilePairs(candleCache, skipVolumeFilter = false) {
  try {
    if (!hasFuturesData()) await loadFuturesSymbols(candleCache);

    const url = 'https://api.binance.com/api/v3/ticker/24hr';
    const response = await axios.get(url);

    const futuresSet = new Set(getFuturesSymbols());

    let eligible = response.data
      .filter(p => futuresSet.has(p.symbol))
      .filter(p => p.symbol.includes('USDT'))
      .filter(p => !p.symbol.includes('UP') && !p.symbol.includes('DOWN'))
      .map(pair => ({ symbol: pair.symbol, highPrice: pair.highPrice, lowPrice: pair.lowPrice }));

    if (VOLUME_FILTER?.ENABLED && !skipVolumeFilter) {
      eligible = filterSymbolsByVolume(eligible, candleCache);
      basicLog(`[INFO] Фильтрация по объёму $${VOLUME_FILTER.MIN_VOLUME_5M_USD} → осталось ${eligible.length} пар`);
      if (eligible.length === 0) {
        console.warn('[INFO] ❗ Ни одна пара не прошла фильтр по объёму.');
        return [];
      }
    }

    let pairs = eligible
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

    pairs.sort((a, b) => b.volatility - a.volatility);

    const topSymbols = pairs.slice(0, TOP_N_PAIRS);

    if (DEBUG_LOG_LEVEL !== 'none') {
      basicLog(`[INFO] Отобрано ${topSymbols.length} самых волатильных`);
      basicLog(`📊 Топ ${topSymbols.length} волатильных пар:`);
      if (DEBUG_LOG_LEVEL === 'verbose') {
        topSymbols.forEach(p => basicLog(`${p.symbol}: ${p.volatility}%`));
      }
    }

    const topVolatileSymbols = topSymbols.map(p => p.symbol);

    if (typeof candleCache !== 'undefined' && topVolatileSymbols.length > 0) {
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
