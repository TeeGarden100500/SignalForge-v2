// SignalForge_MINI_TEST.js — минимальный тест: подписка на BTCUSDT, запись в кэш, расчёт волатильности

const WebSocket = require('ws');
const config = require('./config/config');
const { cache } = require('./logic/multiCandleCache');
const { runBasicIndicators } = require('./logic/strategyManager');
const { evaluateComboStrategies } = require('./logic/comboSignalEngine');

const symbol = 'BTCUSDT';
const tf = '1m';
const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${tf}`;

function handleIncomingCandle(candle) {
  const { symbol, interval, time, open, high, low, close, volume } = candle;
  if (!symbol || !interval) return;

  if (!cache[symbol]) cache[symbol] = {};
  if (!cache[symbol][interval]) cache[symbol][interval] = [];

  const entry = {
    openTime: time,
    open,
    high,
    low,
    close,
    volume,
    closeTime: time
  };

  const candles = cache[symbol][interval];
  candles.push(entry);
  if (candles.length > config.MAX_CACHE_LENGTH) candles.shift();

  console.log(`[cache] ${symbol} [${interval}] => ${candles.length} свечей`);

  if (candles.length >= config.VOLATILITY_LOOKBACK / 1) {
    const highs = candles.map(c => parseFloat(c.high));
    const lows = candles.map(c => parseFloat(c.low));
    const maxHigh = Math.max(...highs);
    const minLow = Math.min(...lows);
    const vol = ((maxHigh - minLow) / minLow) * 100;
    console.log(`[VOLATILITY] ${symbol} за ${candles.length} свечей: ${vol.toFixed(2)}%`);
  }
}

const ws = new WebSocket(wsUrl);

ws.on('open', () => {
  console.log(`[ws] Подключено к ${symbol}@kline_${tf}`);
});

ws.on('message', (data) => {
  try {
    const json = JSON.parse(data);
    const k = json.k;
    if (!k || !k.x) return;

    const candle = {
      symbol,
      interval: tf,
      time: Number(k.t),
      open: k.o,
      high: k.h,
      low: k.l,
      close: k.c,
      volume: k.v
    };

    handleIncomingCandle(candle);
  } catch (e) {
    console.error('[ws] Ошибка:', e.message);
  }
});
