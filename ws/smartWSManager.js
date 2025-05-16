// 🌐 smartWSManager.js — подписка на потоки с лимитом и защитой

const WebSocket = require('ws');
const config = require('../config/config');
const logger = require('../utils/logger');
const { handleIncomingCandle } = require('../logic/multiCandleCache');

let sockets = [];

function connectToStreams(symbols) {
  // ⛔ Отписка от предыдущих сокетов
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
            const kline = json.k;
            if (kline && kline.x) {
              const candle = {
                symbol: symbol,
                tf: tf,
                time: Number(kline.t),
                open: kline.o,
                high: kline.h,
                low: kline.l,
                close: kline.c,
                volume: kline.v
              };
              handleIncomingCandle(candle);
            }
          } catch (e) {
            logger.error(`[ws] Ошибка парсинга сообщения от ${symbol} (${tf}):`, e.message);
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
