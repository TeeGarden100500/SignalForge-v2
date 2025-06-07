const axios = require('axios');
const { TOP_N_PAIRS, DEBUG_LOG_LEVEL } = require('./config');
const { pruneObsoleteSymbols } = require('./utils/pruneCache');
const { loadFuturesSymbols, isFuturesTradable, hasFuturesData } = require('./futuresSymbols');

async function getTopVolatilePairs(candleCache) {
  try {
    if (!hasFuturesData()) await loadFuturesSymbols();

    const url = 'https://api.binance.com/api/v3/ticker/24hr';
    const response = await axios.get(url);

    const allPairs = response.data
      .filter(pair => !pair.symbol.includes('UP') && !pair.symbol.includes('DOWN'))
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
      .filter(Boolean)
      .sort((a, b) => b.volatility - a.volatility);

    let topSymbols = allPairs.slice(0, TOP_N_PAIRS);

    const excluded = topSymbols.filter(p => !isFuturesTradable(p.symbol));
    topSymbols = topSymbols.filter(p => isFuturesTradable(p.symbol));

    if (DEBUG_LOG_LEVEL === 'verbose' && excluded.length) {
      const names = excluded.map(r => r.symbol).join(', ');
      console.log(`[FILTER] Исключены недоступные на фьючерсах пары: ${names}`);
    }

    const topVolatileSymbols = topSymbols.map(p => p.symbol);

    if (typeof candleCache !== 'undefined') {
      pruneObsoleteSymbols(candleCache, topVolatileSymbols);
    }

    if (DEBUG_LOG_LEVEL !== 'none') {
      console.log(`📊 Топ ${TOP_N_PAIRS} волатильных пар:`);
      topSymbols.forEach(p => console.log(`${p.symbol}: ${p.volatility}%`));
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
