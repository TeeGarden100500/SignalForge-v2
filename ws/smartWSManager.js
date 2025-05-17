// ws/smartWSManager.js — отладочная версия

const WebSocket = require('ws');
const { handleIncomingCandle } = require('../logic/multiCandleCache');
const logger = require('../utils/logger');
const config = require('../config/config');

function connectToStreams(symbols) {
  const timeframes = [config.TIMEFRAMES.LEVEL_1];

  symbols.forEach(symbol => {
    timeframes.forEach(tf => {
      const streamName = `${symbol.toLowerCase()}@kline_${tf}`;
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streamName}`);

      ws.on('open', () => {
        logger.basic(`[ws] 🔌 Подключено: ${symbol} (${tf})`);
      });

      ws.on('message', (data) => {
        try {
          const json = JSON.parse(data);

          if (!json || json.e !== 'kline' || !json.k) return;

          // Отладка: показываем даже незакрытые свечи
          if (!json.k.x) {
            logger.verbose(`[ws] ⏳ Незакрытая свеча: ${symbol} (${tf})`);
            return;
          }

          const kline = json.k;
          const candle = {
            symbol,
            tf,
            interval: tf,
            time: Number(kline.t),
            open: parseFloat(kline.o),
            high: parseFloat(kline.h),
            low: parseFloat(kline.l),
            close: parseFloat(kline.c),
            volume: parseFloat(kline.v)
          };

          logger.verbose(`[ws] Передано в handleIncomingCandle: ${JSON.stringify(candle)}`);
          handleIncomingCandle(candle);
        } catch (err) {
          logger.error(`[ws] ❌ Ошибка обработки свечи ${symbol}:`, err.message);
        }
      });

      ws.on('error', (err) => {
        logger.error(`[ws] ❌ Ошибка WebSocket ${symbol} (${tf}):`, err.message);
      });

      ws.on('close', () => {
        logger.basic(`[ws] ❎ Закрыто: ${symbol} (${tf})`);
      });
    });
  });
}

module.exports = { connectToStreams };
