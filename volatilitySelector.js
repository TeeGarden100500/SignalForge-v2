const axios = require('axios');
const { TOP_N_PAIRS, PAIR_SUFFIX, DEBUG_LOG_LEVEL } = require('./config');
const { pruneObsoleteSymbols } = require('./utils/pruneCache');

let TRADING_SYMBOLS = new Set();

async function loadTradingSymbols() {
  try {
    const url = 'https://api.binance.com/api/v3/exchangeInfo';
    const response = await axios.get(url);
    const symbols = response.data.symbols;

    TRADING_SYMBOLS = new Set(
      symbols
        .filter(s => s.status === 'TRADING' && s.symbol.endsWith(PAIR_SUFFIX))
        .map(s => s.symbol)
    );

    if (DEBUG_LOG_LEVEL !== 'none') {
      console.log(`✅ Загружено ${TRADING_SYMBOLS.size} активных пар`);
    }
  } catch (err) {
    console.error('❌ Ошибка загрузки exchangeInfo:', err.message);
  }
}

async function getTopVolatilePairs() {
  try {
    if (TRADING_SYMBOLS.size === 0) await loadTradingSymbols();

    const url = 'https://api.binance.com/api/v3/ticker/24hr';
    const response = await axios.get(url);

    const filtered = response.data
      .filter(pair =>
        TRADING_SYMBOLS.has(pair.symbol) &&
        !pair.symbol.includes('UP') &&
        !pair.symbol.includes('DOWN')
      )
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
      .sort((a, b) => b.volatility - a.volatility)
      .slice(0, TOP_N_PAIRS);
    
pruneObsoleteSymbols(candleCache, topVolatileSymbols);
    
    if (DEBUG_LOG_LEVEL !== 'none') {
      console.log(`📊 Топ ${TOP_N_PAIRS} волатильных пар:`);
      filtered.forEach(p => console.log(`${p.symbol}: ${p.volatility}%`));
    }

    return filtered;
  } catch (err) {
    console.error('❌ Ошибка при расчёте волатильности:', err.message);
    return [];
  }
}

module.exports = {
  getTopVolatilePairs,
};
