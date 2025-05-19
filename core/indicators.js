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

function calculateEMAAngle(candles, period = 21, depth = 5) {
  if (candles.length < period + depth) return null;

  const currentCandles = candles.slice(-depth);
  const firstSlice = candles.slice(-(depth + period), -period);
  const lastSlice = candles.slice(-period);

  const emaStart = calculateEMA(firstSlice, period);
  const emaEnd = calculateEMA(lastSlice, period);

  if (!emaStart || !emaEnd) return null;

  const delta = emaEnd - emaStart;
  const angle = +(delta / depth).toFixed(4); // "наклон за свечу"

  return {
    emaStart,
    emaEnd,
    angle
  };
}

function detectBreakout(candles, lookback = 20) {
  if (candles.length < lookback + 1) return null;

  const recent = candles.slice(-1 - lookback, -1);
  const last = candles.at(-1);

  const highestHigh = Math.max(...recent.map(c => c.high));
  const lowestLow = Math.min(...recent.map(c => c.low));

  const breakoutUp = last.close > highestHigh;
  const breakoutDown = last.close < lowestLow;

  return {
    breakoutUp,
    breakoutDown,
    high: highestHigh,
    low: lowestLow,
    close: last.close
  };
}

function detectHighLowProximity(candles, lookback = 20, threshold = 10) {
  if (candles.length < lookback + 1) return null;

  const recent = candles.slice(-1 - lookback, -1);
  const last = candles.at(-1);

  const high = Math.max(...recent.map(c => c.high));
  const low = Math.min(...recent.map(c => c.low));

  const close = last.close;
  const nearHigh = ((high - close) / high) * 100 <= threshold;
  const nearLow = ((close - low) / low) * 100 <= threshold;

  return {
    nearHigh,
    nearLow,
    high,
    low,
    close
  };
}

module.exports = {
  calculateRSI,
  calculateEMA,
  calculateMACD,
  detectVolumeSpike,
  calculateEMAAngle,
  detectBreakout,
};
