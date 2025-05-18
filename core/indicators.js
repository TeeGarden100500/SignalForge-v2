function calculateRSI(candles, period = 14) {
  if (candles.length < period + 1) return null;

  let gains = 0;
  let losses = 0;

  for (let i = candles.length - period - 1; i < candles.length - 1; i++) {
    const diff = candles[i + 1].close - candles[i].close;
    if (diff >= 0) {
      gains += diff;
    } else {
      losses += Math.abs(diff);
    }
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);

  return +rsi.toFixed(2);
}

function calculateEMA(candles, period) {
  if (candles.length < period) return null;

  const k = 2 / (period + 1);
  let ema = candles.slice(0, period).reduce((sum, c) => sum + c.close, 0) / period;

  for (let i = period; i < candles.length; i++) {
    ema = candles[i].close * k + ema * (1 - k);
  }

  return +ema.toFixed(4);
}

function calculateMACD(candles, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  if (candles.length < slowPeriod + signalPeriod) return null;

  const macdLineArr = [];
  for (let i = 0; i < candles.length; i++) {
    const slice = candles.slice(0, i + 1);
    const fastEMA = calculateEMA(slice, fastPeriod);
    const slowEMA = calculateEMA(slice, slowPeriod);
    if (fastEMA !== null && slowEMA !== null) {
      macdLineArr.push(fastEMA - slowEMA);
    }
  }

  if (macdLineArr.length < signalPeriod) return null;

    const recentMACD = macdLineArr[macdLineArr.length - 1];
    const signal = calculateEMA(macdLineArr.map(v => ({ close: v })), signalPeriod);
    const histogram = recentMACD - signal;

  return {
    macd: +recentMACD.toFixed(4),
    signal: +signal.toFixed(4),
    histogram: +histogram.toFixed(4)
  };
}

function calculateAverageVolume(candles, period = 20) {
  if (candles.length < period + 1) return null;
  const recent = candles.slice(-1 - period, -1);
  const avg = recent.reduce((sum, c) => sum + c.volume, 0) / period;
  return +avg.toFixed(2);
}

function detectVolumeSpike(candles, factor = 1.5) {
  const avgVolume = calculateAverageVolume(candles);
  const lastVolume = candles.at(-1)?.volume;

  if (!avgVolume || !lastVolume) return null;
  const spike = lastVolume > avgVolume * factor;

  return {
    spike,
    ratio: +(lastVolume / avgVolume).toFixed(2),
    volume: lastVolume,
    avgVolume
  };
}


module.exports = {
  calculateRSI,
  calculateEMA,
  calculateMACD,
  detectVolumeSpike,
};
