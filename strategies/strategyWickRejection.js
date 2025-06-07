const { AVERAGE_VOLUME_PERIOD, DOJI_BODY_RATIO } = require('../config');

function checkWickRejection(candles, timeframe) {
  if (!Array.isArray(candles) || candles.length <= AVERAGE_VOLUME_PERIOD) return null;

  const last = candles.at(-1);
  const lookbackSlice = candles.slice(-AVERAGE_VOLUME_PERIOD - 1, -1);
  const avgVolume = lookbackSlice.reduce((sum, c) => sum + c.volume, 0) / lookbackSlice.length;

  const bodySize = Math.abs(last.close - last.open);
  const range = last.high - last.low || 1;
  const upperWick = last.high - Math.max(last.close, last.open);
  const lowerWick = Math.min(last.close, last.open) - last.low;
  const mainWick = Math.max(upperWick, lowerWick);

  const smallBody = bodySize / range <= DOJI_BODY_RATIO;
  const wickRatio = mainWick / (bodySize || 1);

  const closeNearLow = (last.close - last.low) / range <= 0.25;
  const closeNearHigh = (last.high - last.close) / range <= 0.25;

  const rejection = (upperWick > lowerWick && closeNearLow) || (lowerWick > upperWick && closeNearHigh);

  const volumeOk = last.volume >= avgVolume;

  if (smallBody && wickRatio >= 3 && rejection && volumeOk) {
    return {
      timeframe,
      strategy: 'WICK_REJECTION',
      tag: 'WICK_REJECTION',
      message: '📉 WickRejection: мощный отскок от уровня — длинная тень и слабое подтверждение. Возможен разворот.'
    };
  }

  return null;
}

module.exports = { checkWickRejection };
