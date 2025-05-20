const { detectVolumeSpike } = require('./indicators');

function checkVolumeSpikeStrategy(symbol, candles, interval) {
  const result = detectVolumeSpike(candles);
  if (!result || !result.spike) return null;

  return {
    symbol,
    strategy: 'VOLUME_SPIKE',
    tag: 'VOLUME_SPIKE',
    message: `⚡ [${symbol}] Объём выше нормы в ${result.ratio}× (${result.volume} против среднего ${result.avgVolume})`
  };
  
  if (volume < avgVolume * 0.5) {
  return {
    symbol,
    strategy: 'VOLUME_LOW',
    tag: 'VOLUME_LOW',
    message: `💤 [${symbol}] Объём ниже нормы: ${volume.toFixed(2)} против среднего ${avgVolume.toFixed(2)}`
  };
}

module.exports = {
  checkVolumeSpikeStrategy
};
