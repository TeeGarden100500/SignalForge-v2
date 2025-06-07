const axios = require('axios');
const { DEBUG_LOG_LEVEL } = require('./config');

let FUTURES_SYMBOLS = new Set();

async function loadFuturesSymbols() {
  try {
    const url = 'https://fapi.binance.com/fapi/v1/exchangeInfo';
    const response = await axios.get(url);
    const symbols = response.data.symbols || [];

    FUTURES_SYMBOLS = new Set(
      symbols
        .filter(s => s.status === 'TRADING' && s.quoteAsset === 'USDT')
        .map(s => s.symbol)
    );

    if (DEBUG_LOG_LEVEL !== 'none') {
      console.log(`✅ [Futures] Загружено ${FUTURES_SYMBOLS.size} фьючерсных пар`);
    }
  } catch (err) {
    console.error('❌ Ошибка загрузки фьючерсных пар:', err.message);
  }
}

function isFuturesTradable(symbol) {
  return FUTURES_SYMBOLS.has(symbol);
}

function hasFuturesData() {
  return FUTURES_SYMBOLS.size > 0;
}

module.exports = {
  loadFuturesSymbols,
  isFuturesTradable,
  hasFuturesData,
};
