const { MARKET_COMPRESSION } = require('../config');
const { calculateRSI } = require('../core/indicators');
const { basicLog } = require('../utils/logger');

function checkMarketCompression(candles, timeframe) {
  if (!Array.isArray(candles) || candles.length < 3) return null;
  const {
    ENABLED,
    COMPRESSION_VOLUME_DROP,
    COMPRESSION_BODY_DROP,
    TINY_BODY_THRESHOLD,
    RSI_MAX,
    APPLY_ON
  } = MARKET_COMPRESSION || {};

  if (!ENABLED) return null;
  if (Array.isArray(APPLY_ON) && APPLY_ON.length && !APPLY_ON.includes(timeframe)) return null;

  const prev = candles.at(-2);
  const curr = candles.at(-1);

  const volumeDrop = curr.volume < prev.volume * (COMPRESSION_VOLUME_DROP || 1);
  const bodyPrev = Math.abs(prev.close - prev.open);
  const bodyCurr = Math.abs(curr.close - curr.open);
  const bodyDrop = bodyCurr < bodyPrev * (COMPRESSION_BODY_DROP || 1);
  const range = curr.high - curr.low || 1;
  const tinyBody = (bodyCurr / range) <= (TINY_BODY_THRESHOLD || 1);

  const rsi = calculateRSI(candles);
  const rsiOk = rsi !== null ? rsi < (RSI_MAX || 55) : false;

  const priceStable = curr.close >= prev.close || curr.close >= curr.open;

  if (volumeDrop && bodyDrop && tinyBody && priceStable && rsiOk) {
    const msg = `🧊 MARKET COMPRESSION detected (${timeframe}): Продавцы ослабли, возможен импульс вверх.`;
    basicLog(msg);
    return {
      timeframe,
      strategy: 'MARKET_COMPRESSION',
      tag: 'MARKET_COMPRESSION',
      message: msg
    };
  }

  return null;
}

module.exports = { checkMarketCompression };
