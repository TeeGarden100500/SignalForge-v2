const { detectVolumeSpike } = require('./indicators');

function checkVolumeSpikeStrategy(symbol, candles, interval) {
  const result = detectVolumeSpike(candles);
  if (!result || !result.spike) return null;

  return {
    symbol,
    strategy: 'VOLUME_SPIKE',
    message: `⚡ [${symbol}] Объём выше нормы в ${result.ratio}× (${result.volume} против среднего ${result.avgVolume})`
  };
}

module.exports = {
  checkVolumeSpikeStrategy
};
