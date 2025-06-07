const { DOJI_BODY_RATIO, AVERAGE_VOLUME_PERIOD, FLASH_CRASH } = require('../config');

function checkVolumeTrap(candles, timeframe) {
  const { VOLUME_SPIKE_MULTIPLIER } = FLASH_CRASH;

  if (!Array.isArray(candles) || candles.length < AVERAGE_VOLUME_PERIOD + 2) return null;

  const spike = candles.at(-2);
  const next = candles.at(-1);

  const startIdx = candles.length - AVERAGE_VOLUME_PERIOD - 2;
  const slice = candles.slice(startIdx, candles.length - 2);
  const avgVolume = slice.reduce((sum, c) => sum + c.volume, 0) / slice.length;

  const volumeSpike = spike.volume >= avgVolume * VOLUME_SPIKE_MULTIPLIER;

  const bodySize = Math.abs(spike.close - spike.open);
  const range = spike.high - spike.low || 1;
  const smallBody = bodySize / range <= DOJI_BODY_RATIO;

  const spikeBullish = spike.close > spike.open;
  const nextBullish = next.close > next.open;

  const oppositeEngulf = (spikeBullish && !nextBullish && next.close < spike.open) ||
                          (!spikeBullish && nextBullish && next.close > spike.open);

  if (volumeSpike && smallBody && oppositeEngulf) {
    return {
      timeframe,
      strategy: 'VOLUME_TRAP',
      tag: 'VOLUME_TRAP',
      message: '🎭 VolumeTrap: всплеск объёма без импульса. Возможен обман движения и разворот.'
    };
  }

  return null;
}

module.exports = { checkVolumeTrap };
