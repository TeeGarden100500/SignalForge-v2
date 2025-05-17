const WebSocket = require('ws');
const { DEBUG_LOG_LEVEL } = require('./config');
const { TOP_N_PAIRS } = require('./config');

const TIMEFRAMES = ['5m', '15m', '1h'];
const CACHE_LIMIT = 10;

const candleCache = {}; // { BTCUSDT: { '5m': [], '15m': [], '1h': [] } }
const sockets = {};     // { BTCUSDT_5m: WebSocket }
const LAST_UPDATE_TIMEOUT_MS = 1000 * 60 * 60 * 6; // 6 часов без свечей = удалить
const lastUpdatedAt = {}; // { BTCUSDT_5m: timestamp }

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
        const { checkRSIStrategy } = require('./core/strategyRSI');

        const result = checkRSIStrategy(symbol, candleCache[symbol][interval]);
        if (result) {
        console.log(`📢 Сигнал по стратегии ${result.strategy}:`, result.message);
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

setInterval(() => {
  const now = Date.now();

  Object.entries(lastUpdatedAt).forEach(([key, lastUpdate]) => {
    if (now - lastUpdate > LAST_UPDATE_TIMEOUT_MS) {
      const [symbol, interval] = key.split('_');

      // удалить из кэша
      if (candleCache[symbol] && candleCache[symbol][interval]) {
        delete candleCache[symbol][interval];
      }

      // удалить ws
      if (sockets[key]) {
        sockets[key].close();
        delete sockets[key];
      }

      // удалить временную метку
      delete lastUpdatedAt[key];

      console.log(`🗑️ Удалён неактивный поток: ${key}`);
    }
  });
}, 5 * 60 * 1000); // каждые 30 минут проверка на не активные свечи



module.exports = {
  startCandleCollector,
  getCandleCache
};
