const WebSocket = require('ws');
const { DEBUG_LOG_LEVEL } = require('./config');
const { TOP_N_PAIRS } = require('./config');
const { CACHE_LIMITS } = require('./config');
const { checkMACDStrategy } = require('./core/strategyMACD');
const { applyStrategies } = require('./core/applyStrategies');
const { checkComboStrategies } = require('./core/checkCombo');
const { resolveSignalConflicts } = require('./signalConflictResolver');
const { saveCacheToFile } = require('./cache/cacheSaver');
const { loadCacheFromFile } = require('./cache/cacheLoader');
const { loadFromGist, saveToGist } = require('./cache/gistSync');
const { GITHUB_CACHE_ENABLED } = require('./config');
const { isFuturesTradable } = require('./futuresSymbols');
const { removeSymbolsFromCache } = require('./cache/cacheManager');
const { verboseLog, basicLog } = require('./utils/logger');


const TIMEFRAMES = ['5m', '15m', '1h'];

const candleCache = {}; // { BTCUSDT: { '5m': [], '15m': [], '1h': [] } }
const sockets = {};     // { BTCUSDT_5m: WebSocket }
const LAST_UPDATE_TIMEOUT_MS = 1000 * 60 * 60 * 6; // 6 часов без свечей = удалить
const LOG_CACHE_INTERVAL_MS = 5 * 60 * 1000; // каждые 5 минут
const lastUpdatedAt = {}; // { BTCUSDT_5m: timestamp }
const candlesReceived = {}; // { BTCUSDT: { '5m': true } }

function removeSymbolData(symbol) {
  removeSymbolsFromCache(candleCache, symbol);
  TIMEFRAMES.forEach(interval => {
    const key = `${symbol}_${interval}`;
    if (sockets[key]) {
      sockets[key].close();
      delete sockets[key];
    }
    if (lastUpdatedAt[key]) delete lastUpdatedAt[key];
  });
}

function subscribeToKlines(symbol) {
  TIMEFRAMES.forEach(interval => {
    const streamName = `${symbol.toLowerCase()}@kline_${interval}`;
    const url = `wss://stream.binance.com:9443/ws/${streamName}`;
    const socketKey = `${symbol}_${interval}`;

    const ws = new WebSocket(url);

    sockets[socketKey] = ws;

    ws.on('open', () => {
//      log(`🔌 [WS] Подключено: ${socketKey}`);
    });

    ws.on('message', async (data) => {
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

        if (!candlesReceived[symbol]) candlesReceived[symbol] = {};
        candlesReceived[symbol][interval] = true;

        lastUpdatedAt[socketKey] = Date.now();

        if (cache.length > CACHE_LIMITS) cache.shift();
        
      } catch (err) {
        console.error(`❌ Ошибка WS ${symbol} ${interval}:`, err.message);
      }
const candles = candleCache[symbol]?.[interval];
  if (!candles || candles.length < 10) return;

  const { signalTags, messages } = applyStrategies(symbol, candles, interval);
  messages.forEach(msg => verboseLog(`📢 ${msg}`));

    const combos = await checkComboStrategies(symbol, signalTags, interval, candles);
    const resolved = resolveSignalConflicts(combos);
    resolved.forEach(combo => {
      basicLog(combo.message);
    });
      });

    ws.on('error', err => {
      console.error(`❗ WS Error [${socketKey}]`, err.message);
    });

    ws.on('close', (code, reason) => {
    console.warn(`⚠️ WS Закрыт [${socketKey}] Код: ${code} Причина: ${reason?.toString() || 'нет причины'}`);
    });
  });
}

async function startCandleCollector(pairs) {
  const limitedPairs = pairs.slice(0, TOP_N_PAIRS);
  const valid = [];
  const removed = [];

  limitedPairs.forEach(p => {
    const sym = p.symbol || p;
    if (isFuturesTradable(sym)) {
      valid.push(sym);
    } else {
      removed.push(sym);
      removeSymbolData(sym);
    }
  });

  if (DEBUG_LOG_LEVEL === 'verbose' && removed.length) {
    verboseLog(`[WS] Исключены из подписки: ${removed.join(', ')}`);
  }

  valid.forEach(sym => {
    subscribeToKlines(sym);
  });
}

function getCandleCache() {
  return candleCache;
}

setInterval(() => {
  const now = Date.now();

  Object.entries(lastUpdatedAt).forEach(([key, lastUpdate]) => {
    if (now - lastUpdate > LAST_UPDATE_TIMEOUT_MS) {
      const [symbol] = key.split('_');
      removeSymbolData(symbol);
      verboseLog(`🗑️ Удалён неактивный поток: ${key}`);
    }
  });
}, 5 * 60 * 1000); // каждые 30 минут проверка на неактивные свечи

// Загрузка кэша при старте
if (GITHUB_CACHE_ENABLED) {
  loadFromGist().then(gistCache => {
    Object.assign(candleCache, gistCache);
    basicLog(`🗂️ [GIST] Загружено из Gist: ${Object.keys(gistCache).length} символов`);
  }).catch(err => {
    console.warn('⚠️ [GIST] Не удалось загрузить из Gist. Фолбэк на локальный файл.');
    const localCache = loadCacheFromFile();
    Object.assign(candleCache, localCache);
    basicLog(`🗂️ Локальный кэш загружен: ${Object.keys(localCache).length} символов`);
  });
} else {
  const loaded = loadCacheFromFile();
  Object.assign(candleCache, loaded);
  basicLog(`🗂️ Кэш загружен: ${Object.keys(loaded).length} символов`);
}

// Сохранение кэша каждую минуту
setInterval(() => {
  verboseLog(`🌐 Активных WebSocket потоков: ${Object.keys(sockets).length}`);
  const mem = process.memoryUsage().heapUsed / 1024 / 1024;
  verboseLog(`🧠 RAM usage: ${mem.toFixed(2)} MB`);
    if (GITHUB_CACHE_ENABLED) {
    saveToGist(candleCache);
  } else {
    saveCacheToFile(candleCache);
  }
}, 300_000);

// Этот код должен быть размещён в главном файле цикла, где кэш обновляется

module.exports = {
  startCandleCollector,
  getCandleCache,
  candleCache,
  removeSymbolData,
  candlesReceived
};

setInterval(() => {
  if (DEBUG_LOG_LEVEL !== 'verbose') return;

  console.log(`\n🕒 Обзор кэша (каждые 5 минут):`);
  Object.entries(candleCache).forEach(([symbol, timeframes]) => {
    Object.entries(timeframes).forEach(([interval, candles]) => {
      const limit = CACHE_LIMITS[interval] || 100;
      const remaining = Math.max(0, limit - candles.length);

      verboseLog(`🕯️ [${symbol}][${interval}] Кэш: ${candles.length}/${limit} свечей (${remaining} до полной загрузки)`);

      if (candles.length === limit) {
        console.log(`✅ [${symbol}][${interval}] Кэш полностью загружен (${limit})`);
      }
    });
  });
}, LOG_CACHE_INTERVAL_MS);
