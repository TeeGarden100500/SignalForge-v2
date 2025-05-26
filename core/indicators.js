const { RSI_PERIOD, DEBUG_LOG_LEVEL } = require('../config');

                                                                            // === RSI ===
function calculateRSI(candles, period = RSI_PERIOD) {
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

   return rsi;
}
                                                                            // === EMA ===
function calculateEMA(prices, period) {
  const k = 2 / (period + 1);
  let ema = [];
  let sum = 0;

  for (let i = 0; i < prices.length; i++) {
    const price = prices[i];

    if (i < period) {
      sum += price;
      ema.push(null); // Недостаточно данных
    } else if (i === period) {
      const sma = sum / period;
      ema.push(sma);
    } else {
      const prev = ema[ema.length - 1];
      const current = price * k + prev * (1 - k);
      ema.push(current);
    }
  }
  return ema;
  }

  const { EMA_SETTINGS } = require('../config');
                                                            // === EMAAngle ===
function calculateEMAAngle(candles) {
  const EMA_PERIOD = EMA_SETTINGS.PERIOD;
  const EMA_DEPTH = EMA_SETTINGS.DEPTH;

  if (DEBUG_LOG_LEVEL === 'verbose') {
  console.log('🧪 [DEBUG] Всего свечей:', candles.length);
}

  if (candles.length < EMA_PERIOD + EMA_DEPTH) {
    if (DEBUG_LOG_LEVEL !== 'verbose') {
    console.log('⛔ [DEBUG] Недостаточно свечей для EMA уголка');
  }
    return null;
  }

  const firstSlice = candles.slice(-(EMA_PERIOD + EMA_DEPTH + 1), -EMA_DEPTH);
  const lastSlice  = candles.slice(-EMA_PERIOD - 1);

  const emaStartSeries = calculateEMA(firstSlice.map(c => c.close), EMA_PERIOD);
  const emaEndSeries = calculateEMA(lastSlice.map(c => c.close), EMA_PERIOD);

  const emaStart = emaStartSeries.at(-1);
  const emaEnd = emaEndSeries.at(-1);

  if (DEBUG_LOG_LEVEL === 'verbose') {
  console.log('📈 [DEBUG] firstSlice.length:', firstSlice.length);
  console.log('📉 [DEBUG] lastSlice.length:', lastSlice.length);
  console.log('🧮 [DEBUG] emaStartSeries:', emaStartSeries);
  console.log('🧮 [DEBUG] emaEndSeries:', emaEndSeries);
  }
  
  if (DEBUG_LOG_LEVEL !== 'none') {
  console.log('🎯 [DEBUG] emaStart:', emaStart, 'emaEnd:', emaEnd);
  }

  if (!emaStart || !emaEnd || isNaN(emaStart) || isNaN(emaEnd)) {
    if (DEBUG_LOG_LEVEL !== 'none') {
    console.log('[DEBUG] Invalid EMA values:', { emaStart, emaEnd });
  }
    return null;
  }

  const delta = emaEnd - emaStart;
  const angle = +(delta / EMA_DEPTH).toFixed(4);

  if (DEBUG_LOG_LEVEL !== 'none') {
  console.log(`📐 [DEBUG] EMA angle: ${angle}`);
  }
  return {
    emaStart,
    emaEnd,
    angle,
  };
  }

  const { MACD_SETTINGS } = require('../config');
                                                                               // === MACD ===
function calculateMACD(candles) {
  const { FAST_PERIOD, SLOW_PERIOD, SIGNAL_PERIOD } = MACD_SETTINGS;

  if (candles.length < SLOW_PERIOD + SIGNAL_PERIOD) return null;

  const macdLineArr = [];

  for (let i = 0; i < candles.length; i++) {
    if (DEBUG_LOG_LEVEL === 'verbose') {
  console.log(`[DEBUG] macdLineArr.length: ${macdLineArr.length}`);
}

    if (macdLineArr.length < SIGNAL_PERIOD + 2) {
    if (DEBUG_LOG_LEVEL !== 'none') {
    console.log('[DEBUG] MACD Divergence: недостаточно значений в macdLineArr');
  }
    return null;
    }
    const slice = candles.slice(0, i + 1);
    const fastEMA = calculateEMA(slice, FAST_PERIOD);
    const slowEMA = calculateEMA(slice, SLOW_PERIOD);
    
    if (DEBUG_LOG_LEVEL === 'verbose') {
  console.log(`[DEBUG][${i}] slice.length: ${slice.length}, fastEMA: ${fastEMA}, slowEMA: ${slowEMA}`);
}
    if (fastEMA != null && slowEMA != null) {
      macdLineArr.push(fastEMA - slowEMA);
    }
  }

   if (macdLineArr.length < SIGNAL_PERIOD) return null;

  const recentMACD = macdLineArr.at(-1);
  const signalSeries = calculateEMA(macdLineArr.map(v => ({ close: v })), SIGNAL_PERIOD);
  const signal = signalSeries?.at(-1); // Проверка на наличие

  if (signal == null) return null;

  const histogram = recentMACD - signal;

  return {
    macd: +recentMACD.toFixed(4),
    signal: +signal.toFixed(4),
    histogram: +histogram.toFixed(4)
  };
  }

                                                                                // === Volume Settings ===
  const { AVERAGE_VOLUME_PERIOD, VOLUME_SPIKE_FACTOR, } = require('../config');
function calculateAverageVolume(candles, period = AVERAGE_VOLUME_PERIOD) {
  if (candles.length < period + 1) return null;

  const recent = candles.slice(-1 - period, -1);
  const avg = recent.reduce((sum, c) => sum + c.volume, 0) / period;
  return +avg.toFixed(2);
  }

function detectVolumeSpike(candles, factor = VOLUME_SPIKE_FACTOR) {
  const avgVolume = calculateAverageVolume(candles);
  const lastVolume = candles.at(-1)?.volume;

  if (!avgVolume || !lastVolume) return null;
  const spike = lastVolume > avgVolume * factor;

  return {
    spike,
    ratio: +(lastVolume / avgVolume).toFixed(2),
    volume: lastVolume,
    avgVolume,
  };
  }
                                                                                    // === Breakout ===
  const { BREAKOUT_LOOKBACK } = require('../config');
function detectBreakout(candles, lookback = BREAKOUT_LOOKBACK) {
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
                                                                                      // === HighLowProximity ===
  const { BREAKOUT_PROXIMITY } = require('../config');
function detectHighLowProximity(candles) {
  const lookback = BREAKOUT_PROXIMITY.LOOKBACK;
  const threshold = BREAKOUT_PROXIMITY.THRESHOLD;

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
                                                                                      // === MeanReversion ===
  const { MEAN_REVERSION } = require('../config');
function calculateMeanReversion(candles) {
  const maPeriod = MEAN_REVERSION.MA_PERIOD;
  
  if (candles.length < maPeriod + 1) return null;

  const slice = candles.slice(-maPeriod);
  const close = candles.at(-1).close;
  
  const avg = slice.reduce((sum, c) => sum + c.close, 0) / maPeriod;

  const deviation = ((close - avg) / avg) * 100;

  return {
    deviation: +deviation.toFixed(2),
    close,
    ma: +avg.toFixed(2)
  };
  }
                                                                                        // === ATR ===

  const { ATR } = require('../config');
function calculateATR(candles) {
  const period = ATR.PERIOD;
  if (candles.length < period + 1) return null;

  const trValues = [];

  for (let i = 1; i <= period; i++) {
    const prev = candles[candles.length - i - 1];
    const curr = candles[candles.length - i];

    const highLow = curr.high - curr.low;
    const highClose = Math.abs(curr.high - prev.close);
    const lowClose = Math.abs(curr.low - prev.close);

    const trueRange = Math.max(highLow, highClose, lowClose);
    trValues.push(trueRange);
  }

  const atr = trValues.reduce((sum, val) => sum + val, 0) / period;
  return +atr.toFixed(4);
  }

                                                                                      // === ADX ===


  const { ADX_PERIOD } = require('../config');

function calculateADX(candles, period = ADX_PERIOD) {
  if (candles.length < period + 1) return null;

  let prevHigh = candles[0].high;
  let prevLow = candles[0].low;
  let prevClose = candles[0].close;

  const trList = [];
  const plusDM = [];
  const minusDM = [];

for (let i = 1; i <= period; i++) {
  const curr = candles[i];
  const high = curr.high;
  const low = curr.low;

  const upMove = high - prevHigh;
  const downMove = prevLow - low;

  const tr = Math.max(
    high - low,
    Math.abs(high - prevClose),
    Math.abs(low - prevClose)
    );

    trList.push(tr);
    plusDM.push(upMove > downMove && upMove > 0 ? upMove : 0);
    minusDM.push(downMove > upMove && downMove > 0 ? downMove : 0);

    prevHigh = high;
    prevLow = low;
    prevClose = curr.close;
  }

  const tr14 = trList.reduce((sum, v) => sum + v, 0);
  const plusDM14 = plusDM.reduce((sum, v) => sum + v, 0);
  const minusDM14 = minusDM.reduce((sum, v) => sum + v, 0);

  const plusDI = (plusDM14 / tr14) * 100;
  const minusDI = (minusDM14 / tr14) * 100;

  const dx = Math.abs(plusDI - minusDI) / (plusDI + minusDI) * 100;
  const adx = +dx.toFixed(2);

  return {
    adx,
    plusDI: +plusDI.toFixed(2),
    minusDI: +minusDI.toFixed(2)
  };
}
                                                                                        // === FiboLevels ===

const { FIBO_SETTINGS } = require('../config');
function calculateFiboLevels(candles, depth = FIBO_SETTINGS.DEPTH) {

  if (candles.length < depth) return null;

  const slice = candles.slice(-depth);
  const high = Math.max(...slice.map(c => c.high));
  const low = Math.min(...slice.map(c => c.low));

  const diff = high - low;

  const levels = {};
  FIBO_SETTINGS.LEVELS.forEach(level => {
  levels[level.toString()] = +(high - diff * level).toFixed(4);
});


  return {
    high,
    low,
    levels
  };
}



module.exports = {
  calculateRSI,
  calculateEMA,
  calculateEMAAngle,
  calculateMACD,
  detectVolumeSpike,
  detectBreakout,
  detectHighLowProximity,
  calculateMeanReversion,
  calculateATR,
  calculateADX,
  calculateFiboLevels,
};
