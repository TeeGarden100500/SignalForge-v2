const { FLASH_CRASH } = require('../config');

function checkFlashCrashRecovery(candles, timeframe) {
  const { DROP_PERCENT, MAX_CANDLE_WINDOW, MIN_WICK_RATIO, VOLUME_SPIKE_MULTIPLIER } = FLASH_CRASH;

  if (!Array.isArray(candles) || candles.length < MAX_CANDLE_WINDOW) return null;

  const recent = candles.slice(-MAX_CANDLE_WINDOW);
  const peakHigh = Math.max(...recent.map(c => c.high));
  const currentLow = Math.min(...recent.map(c => c.low));
  const dropPercent = ((peakHigh - currentLow) / peakHigh) * 100;

  const last = candles.at(-1);
  const bodySize = Math.abs(last.close - last.open);
  const lowerWick = Math.min(last.open, last.close) - last.low;
  const closeMid = last.low + (last.high - last.low) / 2;
  const avgVolume = recent.reduce((sum, c) => sum + c.volume, 0) / recent.length;

  const longLowerWick = lowerWick > bodySize * MIN_WICK_RATIO;
  const closedAboveMid = last.close > closeMid;
  const volumeSpike = last.volume >= avgVolume * VOLUME_SPIKE_MULTIPLIER;

  if (dropPercent >= DROP_PERCENT && longLowerWick && closedAboveMid && volumeSpike) {
    return {
      timeframe,
      strategy: 'FLASH_CRASH_RECOVERY',
      tag: 'FLASH_CRASH_RECOVERY',
      dropPercent: +dropPercent.toFixed(2),
      message: `🧨 FlashCrashRecovery: падение на ${dropPercent.toFixed(1)}% за ${MAX_CANDLE_WINDOW} свечей с возвратом. Возможен сбор стопов и разворот.`
    };
  }

  return null;
}

module.exports = { checkFlashCrashRecovery };
