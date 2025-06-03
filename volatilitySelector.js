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

async function getTopVolatilePairs(candleCache) {
  try {
    if (TRADING_SYMBOLS.size === 0) await loadTradingSymbols();

    const url = 'https://api.binance.com/api/v3/ticker/24hr';
    const response = await axios.get(url);

    // ⛔️ Удаляем мёртвые пары с низким объёмом
    const MIN_VOLUME = 100_000;
    const tradablePairs = response.data.filter(t =>
      TRADING_SYMBOLS.has(t.symbol) &&
      parseFloat(t.quoteVolume) >= MIN_VOLUME
    );

    const sorted = tradablePairs
      .map(t => ({
        symbol: t.symbol,
        volatility: Math.abs(parseFloat(t.priceChangePercent))
      }))
      .sort((a, b) => b.volatility - a.volatility);

    const filtered = sorted.slice(0, TOP_N_PAIRS);
    const topVolatileSymbols = filtered.map(p => p.symbol);

    if (DEBUG_LOG_LEVEL !== 'none') {
      console.log(`📈 Выбрано ${topVolatileSymbols.length} топ-пар из ${tradablePairs.length} ликвидных USDT`);
    }

    pruneObsoleteSymbols(candleCache, topVolatileSymbols);
    return filtered;

  } catch (err) {
    console.error('❌ Ошибка при расчёте волатильности:', err.message);

  return {
    symbol: pair.symbol,
    volatility: +volatility.toFixed(2),
  }
  }
      });
      .filter(Boolean)
      .sort((a, b) => b.volatility - a.volatility)
      .slice(0, TOP_N_PAIRS);
    
const topVolatileSymbols = filtered.map(p => p.symbol);

// ВАЖНО: candleCache должен быть передан в эту функцию извне!
if (typeof candleCache !== 'undefined') {
  pruneObsoleteSymbols(candleCache, topVolatileSymbols);
}

    
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
