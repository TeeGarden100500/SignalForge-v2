// ws/smartWSManager.js
const WebSocket = require('ws');
const config = require('../config/config');
const { logInfo } = require('../utils/logger');

const streams = {};

function setupSymbolSubscriptions(symbols) {
  symbols.forEach(symbol => {
    config.TIMEFRAMES && Object.values(config.TIMEFRAMES).forEach(interval => {
      const streamKey = `${symbol.toLowerCase()}@kline_${interval}`;
      const wsUrl = `${config.BINANCE_STREAM_URL}/${streamKey}`;

      const ws = new WebSocket(wsUrl);

      ws.on('open', () => {
        logInfo(`Подписка на ${streamKey}`);
      });

      ws.on('message', (data) => {
        // Обработка полученной свечи будет добавлена позже
        logInfo(`Получена свеча по ${streamKey}`);
      });

      ws.on('close', () => logInfo(`Закрыто соединение для ${streamKey}`));
      ws.on('error', (err) => logInfo(`Ошибка WebSocket по ${streamKey}: ${err.message}`));

      streams[streamKey] = ws;
    });
  });
}

module.exports = {
  setupSymbolSubscriptions
};
