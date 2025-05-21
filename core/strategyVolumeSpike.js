// const { detectVolumeSpike } = require('./indicators');

function checkVolumeSpikeStrategy(symbol, candles, interval) {
  // --- СТАРАЯ ЛОГИКА ---
  /*
  const result = detectVolumeSpike(candles);
  if (!result || !result.spike) return null;

  const volume = candles.at(-1).volume;
  const prevVolume = result.avgVolume;

  if (volume < prevVolume * 1) {
    return {
      symbol,
      strategy: 'VOLUME_DROP',
      tag: 'VOLUME_DROP',
      message: `📉 [${symbol}] Объём резко снизился: ${volume.toFixed(2)} < ${prevVolume.toFixed(2)}`
    };
  }

  return {
    symbol,
    strategy: 'VOLUME_SPIKE',
    tag: 'VOLUME_SPIKE',
    message: `⚡ [${symbol}] Объём выше нормы в ${result.ratio}× (${result.volume} против среднего ${result.avgVolume})`
  };
  */

  // --- ЭМУЛЯЦИЯ ---
  console.log(`[SIMULATION] ${symbol}: FORCED VOLUME_SPIKE + VOLUME_DROP`);
  return [
    {
      symbol,
      strategy: 'VOLUME_SPIKE',
      tag: 'VOLUME_SPIKE',
      message: `⚡ [${symbol}] (SIMULATED) Объём выше нормы`
    },
    {
      symbol,
      strategy: 'VOLUME_DROP',
      tag: 'VOLUME_DROP',
      message: `📉 [${symbol}] (SIMULATED) Объём ниже нормы`
    }
  ];
}

module.exports = {
  checkVolumeSpikeStrategy
};
