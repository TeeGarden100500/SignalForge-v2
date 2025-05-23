const { detectVolumeSpike } = require('./indicators');

function checkVolumeSpikeStrategy(symbol, candles, timeframe) {

  const result = detectVolumeSpike(candles);
  if (!result || !result.spike) return null;

  const volume = candles.at(-1).volume;
  const prevVolume = result.avgVolume;

  if (volume < prevVolume * 0.5) {
    return {
      symbol, timeframe,
      strategy: 'VOLUME_DROP',
      tag: 'VOLUME_DROP',
      message: `📉 [${symbol}] Объём резко снизился: ${volume.toFixed(2)} < ${prevVolume.toFixed(2)}`
    };
  }
 if (volume > prevVolume * 3) {
  return {
    symbol, timeframe,
    strategy: 'VOLUME_SPIKE',
    tag: 'VOLUME_SPIKE',
    message: `⚡ [${symbol}] Объём выше нормы в ${result.ratio}× (${result.volume} против среднего ${result.avgVolume})`
  };
}

module.exports = {
  checkVolumeSpikeStrategy
};
