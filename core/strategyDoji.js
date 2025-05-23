const { DOJI_BODY_RATIO } = require('../config');

function checkDojiPattern(candles, timeframe) {
  if (!Array.isArray(candles) || candles.length < 3) return null;

  const lastCandle = candles.at(-1);
  const body = Math.abs(lastCandle.open - lastCandle.close);
  const range = lastCandle.high - lastCandle.low;

  const isDoji = body / range < DOJI_BODY_RATIO; // 🔧 Условие для Doji: тело составляет менее 30% от полного диапазона свечи

  if (isDoji) {
    return {
      timeframe,
      strategy: 'DOJI',
      tag: 'DOJI',
      message: `📌 [DOJI] Найден разворотный паттерн Doji`
    };
  }

  return null;
}

module.exports = { checkDojiPattern };
