// debugStandaloneWS.js — простая отладка Binance потока на 1 монету

const WebSocket = require('ws');

const symbol = 'btcusdt';
const interval = '1m';

const stream = `${symbol}@kline_${interval}`;
const url = `wss://stream.binance.com:9443/ws/${stream}`;

const ws = new WebSocket(url);

ws.on('open', () => {
  console.log(`[debug] 🔌 Подключено к ${stream}`);
});

ws.on('message', (data) => {
  try {
    const json = JSON.parse(data);
    if (json && json.e === 'kline') {
      const k = json.k;
      console.log(`[debug] 🔔 Пришла свеча: time=${k.t}, close=${k.c}, закрыта=${k.x}`);
    }
  } catch (err) {
    console.error('[debug] ❌ Ошибка при парсинге:', err.message);
  }
});

ws.on('error', (err) => {
  console.error('[debug] ❌ Ошибка WebSocket:', err.message);
});

ws.on('close', () => {
  console.log('[debug] ❎ Соединение закрыто');
});
