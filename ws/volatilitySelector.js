// ws/volatilitySelector.js
const WebSocket = require('ws');
const config = require('../config/config');
const { logVerbose, logInfo } = require('../utils/logger');

let lastSelectionTime = 0;

function selectTopVolatileSymbols() {
  return new Promise((resolve) => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

    ws.on('message', (data) => {
      const tickers = JSON.parse(data);
      const now = Date.now();
      if (now - lastSelectionTime < config.VOLATILITY_REFRESH_INTERVAL_SEC * 1000) return;
      lastSelectionTime = now;

      const sorted = tickers
        .filter(t => t.s.endsWith('USDT'))
        .map(t => ({ symbol: t.s, percent: Math.abs(parseFloat(t.P)) }))
        .sort((a, b) => b.percent - a.percent)
        .slice(0, config.VOLATILITY_TOP_N);

      const symbols = sorted.map(t => t.symbol);
      logVerbose(`Отобрано по волатильности: ${symbols.join(', ')}`);

      ws.close();
      resolve(symbols);
    });

    ws.on('error', (err) => {
      logInfo('Ошибка WebSocket в volatilitySelector:', err);
      resolve([]);
    });
  });
}

module.exports = {
  selectTopVolatileSymbols
};
