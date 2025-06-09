const { MARKET_COMPRESSION } = require('../config');

function checkMarketCompression(candles, timeframe) {
  if (!Array.isArray(candles) || candles.length < 2) return null;
  const { ENABLED, COMPRESSION_THRESHOLD, MIN_CANDLE_BODY, APPLY_ON } = MARKET_COMPRESSION || {};
  if (!ENABLED) return null;
  if (Array.isArray(APPLY_ON) && APPLY_ON.length && !APPLY_ON.includes(timeframe)) return null;

  const c1 = candles.at(-2); // previous closed candle
  const c2 = candles.at(-1); // latest closed candle

  const body1 = Math.abs(c1.close - c1.open);
  const body2 = Math.abs(c2.close - c2.open);
  if (body1 < MIN_CANDLE_BODY || body2 < MIN_CANDLE_BODY) return null;

  const ratio1 = body1 / (c1.volume || 1);
  const ratio2 = body2 / (c2.volume || 1);

  if (
    ratio2 < ratio1 &&
    ratio2 < COMPRESSION_THRESHOLD &&
    body2 < body1 &&
    c2.volume < c1.volume
  ) {
    return {
      timeframe,
      strategy: 'MARKET_COMPRESSION',
      tag: 'MARKET_COMPRESSION',
      message: '📉 Market Compression — рынок сжался: тело ↓, объём ↓. Возможен пробой.'
    };
  }

  return null;
}

module.exports = { checkMarketCompression };
