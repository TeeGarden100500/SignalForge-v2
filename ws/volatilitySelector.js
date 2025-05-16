const WebSocket = require('ws');
const config = require('../config/config');
const { logVerbose, logError } = require('../utils/logger');

let lastSelectionTime = 0;

function selectTopVolatileSymbols() {
  return new Promise((resolve) => {
    const now = Date.now();

    if (now - lastSelectionTime < config.VOLATILITY_REFRESH_INTERVAL_SEC * 1000) {
      logVerbose('[volatility] Пропущен повторный отбор (ещё не прошло время).');
      return resolve([]);
    }

    const ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
    const fallback = setTimeout(() => {
      logError('[volatility] Binance WS не ответил вовремя. Возврат пустого массива.');
      ws.terminate();
      resolve([]);
    }, 5000);

    ws.on('message', (data) => {
      try {
        const tickers = JSON.parse(data);
        const filtered = tickers
          .filter(t => t.s.endsWith('USDT'))
          .map(t => ({ symbol: t.s, percent: Math.abs(parseFloat(t.P)) }))
          .sort((a, b) => b.percent - a.percent)
          .slice(0, config.VOLATILITY_TOP_N || 20);

        const symbols = filtered.map(t => t.symbol);
        lastSelectionTime = now;
        clearTimeout(fallback);
        ws.close();

        logVerbose(`[volatility] Отобрано по волатильности: ${symbols.join(', ')}`);
        resolve(symbols);
      } catch (err) {
        clearTimeout(fallback);
        ws.terminate();
        logError('[volatility] Ошибка разбора данных Binance:', err.message);
        resolve([]);
      }
    });

    ws.on('error', (err) => {
      clearTimeout(fallback);
      ws.terminate();
      logError('[volatility] Ошибка WebSocket Binance:', err.message);
      resolve([]);
    });
  });
}

module.exports = {
  selectTopVolatileSymbols
};
