// 🌐 smartWSManager.js — подписка на потоки с лимитом и защитой + лог содержимого при ошибке

const WebSocket = require('ws');
const config = require('../config/config');
const logger = require('../utils/logger');
const { handleIncomingCandle } = require('../logic/multiCandleCache');

let sockets = [];

function connectToStreams(symbols) {
  sockets.forEach(ws => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  });
  sockets = [];

  const timeframes = Object.values(config.TIMEFRAMES);
  const maxConnections = config.MAX_WEBSOCKET_CONNECTIONS || 50;
  let activeCount = 0;

  for (const symbol of symbols) {
    for (const tf of timeframes) {
      if (activeCount >= maxConnections) {
        logger.verbose(`[ws] Пропущена подписка на ${symbol} (${tf}) — достигнут лимит ${maxConnections}`);
        continue;
      }

      const streamName = `${symbol.toLowerCase()}@kline_${tf}`;
      const wsUrl = `wss://stream.binance.com:9443/ws/${streamName}`;

      try {
        const ws = new WebSocket(wsUrl);
        sockets.push(ws);
        activeCount++;

        ws.on('open', () => {
          logger.verbose(`[ws] Подключено: ${symbol} (${tf})`);
        });

       ws.on('message', (msg) => {
  try {
    const json = JSON.parse(msg);

    if (!json || json.e !== 'kline' || !json.k || !json.k.x) return;

    const kline = json.k;

    const candle = {
      symbol,
      tf,
      time: Number(kline.t),
      open: parseFloat(kline.o),
      high: parseFloat(kline.h),
      low: parseFloat(kline.l),
      close: parseFloat(kline.c),
      volume: parseFloat(kline.v)
    };
    
try {
  logger.verbose(`[ws] Передано в handleIncomingCandle: ${JSON.stringify(candle)}`);
  handleIncomingCandle(candle);
} catch (err) {
  logger.error(`[ws] Ошибка внутри handleIncomingCandle для ${symbol} (${tf}):`, err.message);
}

    handleIncomingCandle(candle);

  } catch (e) {
    logger.error(`[ws] Ошибка парсинга сообщения от ${symbol} (${tf}):`, e.message);
    logger.verbose(`[ws] Содержание сообщения от ${symbol} (${tf}): ${msg}`);
  }
});
        ws.on('error', (err) => {
          logger.error(`[ws] Ошибка WebSocket по ${symbol} (${tf}):`, err.message);
        });

        ws.on('close', () => {
          logger.verbose(`[ws] Соединение закрыто: ${symbol} (${tf})`);
        });

      } catch (err) {
        logger.error(`[ws] Ошибка при создании WebSocket по ${symbol} (${tf}):`, err.message);
      }
    }
  }

  logger.basic(`[ws] Подключено потоков: ${activeCount}/${maxConnections}`);
}

module.exports = { connectToStreams };
