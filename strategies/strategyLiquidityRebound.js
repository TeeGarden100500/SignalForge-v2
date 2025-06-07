const { AVERAGE_VOLUME_PERIOD, DOJI_BODY_RATIO } = require('../config');

function checkLiquidityRebound(candles, timeframe, levels = []) {
  if (!Array.isArray(candles) || candles.length <= AVERAGE_VOLUME_PERIOD) return null;
  if (!Array.isArray(levels) || levels.length === 0) return null;

  const last = candles.at(-1);
  const lookbackSlice = candles.slice(-AVERAGE_VOLUME_PERIOD - 1, -1);
  const avgVolume = lookbackSlice.reduce((sum, c) => sum + c.volume, 0) / lookbackSlice.length;

  const touched = levels.find(level => last.low <= level && last.high >= level);
  if (!touched) return null;

  const bounceUp = last.low <= touched && last.close > touched;
  const bounceDown = last.high >= touched && last.close < touched;
  if (!bounceUp && !bounceDown) return null;

  const bodySize = Math.abs(last.close - last.open);
  const range = last.high - last.low || 1;
  const smallBody = bodySize / range <= DOJI_BODY_RATIO;
  const highVolume = last.volume >= avgVolume;

  if (smallBody && highVolume) {
    return {
      timeframe,
      strategy: 'LIQUIDITY_REBOUND',
      tag: 'LIQUIDITY_REBOUND',
      level: touched,
      message: '📌 LiquidityRebound: отскок от уровня ликвидности. Возможен продолжительный откат или разворот.'
    };
  }

  return null;
}

module.exports = { checkLiquidityRebound };
