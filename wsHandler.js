const WebSocket = require('ws');
const { DEBUG_LOG_LEVEL } = require('./config');
const { TOP_N_PAIRS } = require('./config');

const TIMEFRAMES = ['5m', '15m', '1h'];
const CACHE_LIMIT = 100;

const candleCache = {}; // { BTCUSDT: { '5m': [], '15m': [], '1h': [] } }
const sockets = {};     // { BTCUSDT_5m: WebSocket }

function log(...args) {
  if (DEBUG_LOG_LEVEL === 'verbose') {
    console.log(...args);
  }
}

function subscribeToKlines(symbol) {
  TIMEFRAMES.forEach(interval => {
    const streamName = `${symbol.toLowerCase()}@kline_${interval}`;
    const url = `wss://stream.binance.com:9443/ws/${streamName}`;
    const socketKey = `${symbol}_${interval}`;

    const ws = new WebSocket(url);

    sockets[socketKey] = ws;

    ws.on('open', () => {
      log(`🔌 [WS] Подключено: ${socketKey}`);
    });

    ws.on('message', (data) => {
      try {
        const json = JSON.parse(data);
        const kline = json.k;

        if (!kline.x) return; // ждём, пока свеча закроется (final)

        const candle = {
          time: kline.t,
          open: parseFloat(kline.o),
          high: parseFloat(kline.h),
          low: parseFloat(kline.l),
          close: parseFloat(kline.c),
          volume: parseFloat(kline.v),
        };

        if (!candleCache[symbol]) candleCache[symbol] = {};
        if (!candleCache[symbol][interval]) candleCache[symbol][interval] = [];

        const cache = candleCache[symbol][interval];
        cache.push(candle);

        if (cache.length > CACHE_LIMIT) cache.shift();

        log(`🕯️ [${symbol}][${interval}] Кэш: ${cache.length} свечей`);
      } catch (err) {
        console.error(`❌ Ошибка WS ${symbol} ${interval}:`, err.message);
      }
    });

    ws.on('error', err => {
      console.error(`❗ WS Error [${socketKey}]`, err.message);
    });

    ws.on('close', () => {
      console.warn(`⚠️ WS Закрыт [${socketKey}]`);
    });
  });
}

function startCandleCollector(pairs) {
  const limitedPairs = pairs.slice(0, TOP_N_PAIRS); // максимум 50 для WebSocket лимита

  limitedPairs.forEach(p => {
    subscribeToKlines(p.symbol || p); // если просто строка, или объект { symbol }
  });
}

function getCandleCache() {
  return candleCache;
}

module.exports = {
  startCandleCollector,
  getCandleCache
};
