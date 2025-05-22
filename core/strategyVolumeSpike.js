const { detectVolumeSpike } = require('./indicators');

function checkVolumeSpikeStrategy(symbol, candles, interval) {

  const result = detectVolumeSpike(candles, timeframe);
  if (!result || !result.spike) return null;

  const volume = candles.at(-1).volume;
  const prevVolume = result.avgVolume;

  if (volume < prevVolume * 1) {
    return {
      symbol,
      strategy: 'VOLUME_DROP',
      tag: 'VOLUME_DROP',
      timeframe,
      message: `📉 [${symbol}] Объём резко снизился: ${volume.toFixed(2)} < ${prevVolume.toFixed(2)}`
    };
  }

  return {
    symbol,
    strategy: 'VOLUME_SPIKE',
    tag: 'VOLUME_SPIKE',
    timeframe,
    message: `⚡ [${symbol}] Объём выше нормы в ${result.ratio}× (${result.volume} против среднего ${result.avgVolume})`
  };
}

module.exports = {
  checkVolumeSpikeStrategy
};
