const axios = require('axios');
const { TOP_N_PAIRS, PAIR_SUFFIX, DEBUG_LOG_LEVEL } = require('./config');

async function getTopVolatilePairs() {
  try {
    const url = 'https://api.binance.com/api/v3/ticker/24hr';
    const response = await axios.get(url);

    const filtered = response.data
      .filter(pair => pair.symbol.endsWith(PAIR_SUFFIX) && !pair.symbol.includes('UP') && !pair.symbol.includes('DOWN'))
      .map(pair => {
        const high = parseFloat(pair.highPrice);
        const low = parseFloat(pair.lowPrice);
        const volatility = ((high - low) / low) * 100;
        return {
          symbol: pair.symbol,
          volatility: +volatility.toFixed(2),
        };
      })
      .sort((a, b) => b.volatility - a.volatility)
      .slice(0, TOP_N_PAIRS);

    if (DEBUG_LOG_LEVEL !== 'none') {
      console.log(`📊 Топ ${TOP_N_PAIRS} волатильных пар:`);
      filtered.forEach(p => console.log(`${p.symbol}: ${p.volatility}%`));
    }

    return filtered;
  } catch (err) {
    console.error('❌ Ошибка при получении волатильности:', err.message);
    return [];
  }
}

module.exports = { getTopVolatilePairs };
