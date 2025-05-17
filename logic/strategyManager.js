// 📊 strategyManager.js — Расчёт одиночных индикаторов и генерация условий

const { RSI, EMA, MACD, ATR, ADX } = require('technicalindicators');
const config = require('../config/config');
const logger = require('../utils/logger');
const fibonacci = require('../core/fibonacci');
const breakoutDetector = require('../core/breakoutDetector');
const yearHighLow = require('../data/yearHighLow.json');
const manualLevels = require('../data/manualLevels.json');
const { saveIndicators } = require('../core/indicatorStore');

function calculateIndicators(candles, symbol, tf) {
  const closes = candles.map(c => parseFloat(c.close));
  const highs = candles.map(c => parseFloat(c.high));
  const lows = candles.map(c => parseFloat(c.low));

  const result = {
    conditions: [],
    price: closes.at(-1) || null
  };

  const nowUTC = new Date().toISOString().slice(11, 16);
  const { start, end } = config.SIGNAL_TIME_WINDOW_UTC;
  if (nowUTC < start || nowUTC > end) {
    logger.basic(`[${symbol} | ${tf}] Вне временного окна сигналов (${start}-${end})`);
    return result;
  }

  // ✅ RSI
  const rsi = RSI.calculate({ values: closes, period: config.RSI_PERIOD });
  const lastRSI = rsi.at(-1);
  if (lastRSI !== undefined) {
    if (lastRSI < config.RSI_LOW) result.conditions.push('RSI_LOW');
    else if (lastRSI > config.RSI_HIGH) result.conditions.push('RSI_HIGH');
  }

  // ✅ EMA Cross
  const emaFast = EMA.calculate({ values: closes, period: config.EMA_FAST });
  const emaSlow = EMA.calculate({ values: closes, period: config.EMA_SLOW });
  const [f2, f1] = emaFast.slice(-2);
  const [s2, s1] = emaSlow.slice(-2);
  if (f1 > s1 && f2 <= s2) result.conditions.push('EMA_CROSS_UP');
  if (f1 < s1 && f2 >= s2) result.conditions.push('EMA_CROSS_DOWN');

  // ✅ EMA угол
  const emaAngle = EMA.calculate({ values: closes, period: config.EMA_ANGLE_PERIOD });
  if (emaAngle.length >= config.EMA_ANGLE_LENGTH) {
    const tail = emaAngle.slice(-config.EMA_ANGLE_LENGTH);
    const slope = (tail.at(-1) - tail[0]) / config.EMA_ANGLE_LENGTH;
    if (slope > config.EMA_ANGLE_THRESHOLD) result.conditions.push('EMA_ANGLE_UP');
    if (slope < -config.EMA_ANGLE_THRESHOLD) result.conditions.push('EMA_ANGLE_DOWN');
  }

  // ✅ MACD Histogram
  const macd = MACD.calculate({
    values: closes,
    fastPeriod: config.MACD_FAST,
    slowPeriod: config.MACD_SLOW,
    signalPeriod: config.MACD_SIGNAL,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  });
  const lastMACD = macd.at(-1);
  if (lastMACD?.histogram > 0) result.conditions.push('MACD_HIST_POSITIVE');
  if (lastMACD?.histogram < 0) result.conditions.push('MACD_HIST_NEGATIVE');

  // ✅ Volume Spike
  const volumes = candles.map(c => parseFloat(c.volume));
  const volAvg = volumes.slice(-config.VOLUME_LOOKBACK).reduce((a, b) => a + b, 0) / config.VOLUME_LOOKBACK;
  if (volumes.at(-1) > volAvg * config.VOLUME_SPIKE_MULTIPLIER) result.conditions.push('VOLUME_SPIKE');

  // ✅ ATR — волатильность
  const atr = ATR.calculate({ high: highs, low: lows, close: closes, period: config.ATR_PERIOD });
  const atrNow = atr.at(-1);
  const atrPct = (atrNow / closes.at(-1)) * 100;
  if (atrPct > config.MIN_ATR_PERCENT) result.conditions.push('HIGH_VOLATILITY');

  // ✅ ADX — сила тренда
  const adx = ADX.calculate({ high: highs, low: lows, close: closes, period: config.ADX_PERIOD });
  const adxNow = adx.at(-1)?.adx;
  if (adxNow && adxNow > config.MIN_ADX) result.conditions.push('STRONG_TREND');

  // ✅ FIBO
  const yearly = yearHighLow[symbol];
  if (yearly?.high && yearly?.low && result.price) {
    if (fibonacci.isNearFiboLevel(result.price, yearly.high, yearly.low)) {
      result.conditions.push('TOUCH_FIBO');
    }
  }

  // ✅ Manual уровни + пробой
  const manual = manualLevels[symbol];
  const tol = config.FIBO_TOLERANCE_PERCENT / 100;
  if (manual && result.price) {
    manual.support?.forEach(lvl => {
      if (Math.abs(result.price - lvl) / lvl <= tol) result.conditions.push('TOUCH_SUPPORT');
    });
    manual.resistance?.forEach(lvl => {
      if (Math.abs(result.price - lvl) / lvl <= tol) result.conditions.push('TOUCH_RESISTANCE');
    });

    // ➕ Проверка пробоя уровней
    const breakouts = breakoutDetector.checkBreakout(candles, manual.resistance || [], 'resistance');
    const breakdowns = breakoutDetector.checkBreakout(candles, manual.support || [], 'support');
    breakouts.forEach(b => result.conditions.push(b.type));
    breakdowns.forEach(b => result.conditions.push(b.type));
  }

  // 💾 Сохраняем индикаторы
  saveIndicators(symbol, tf, {
    rsi: lastRSI,
    emaFast: f1,
    emaSlow: s1,
    macd: lastMACD
  });

  logger.verbose(`[${symbol} | ${tf}] Условия: ${result.conditions.join(', ') || 'нет'} | Цена: ${result.price}`);

  return result;
}

module.exports = { calculateIndicators };
