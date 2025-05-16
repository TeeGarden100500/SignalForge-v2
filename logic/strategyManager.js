// 📊 strategyManager.js — расчет одиночных индикаторов и условий для comboEngine

const { RSI, EMA, MACD } = require('technicalindicators');
const config = require('../config/config');
const logger = require('../utils/logger');
const fibonacci = require('../core/fibonacci');
const yearHighLow = require('../data/yearHighLow.json');
const manualLevels = require('../data/manualLevels.json');

function calculateIndicators(candles, symbol, tf) {
  const closes = candles.map(c => parseFloat(c.close));

  const result = {
    conditions: [],
    price: closes[closes.length - 1] || null
  };

  // ✅ RSI
  const rsi = RSI.calculate({ values: closes, period: config.RSI_PERIOD });
  const lastRSI = rsi[rsi.length - 1];
  if (lastRSI !== undefined) {
    if (lastRSI < config.RSI_LOW) result.conditions.push('RSI_LOW');
    else if (lastRSI > config.RSI_HIGH) result.conditions.push('RSI_HIGH');
  }

  // ✅ EMA Crossover
  const emaFast = EMA.calculate({ values: closes, period: config.EMA_FAST });
  const emaSlow = EMA.calculate({ values: closes, period: config.EMA_SLOW });
  const latestFast = emaFast[emaFast.length - 1];
  const latestSlow = emaSlow[emaSlow.length - 1];
  const prevFast = emaFast[emaFast.length - 2];
  const prevSlow = emaSlow[emaSlow.length - 2];
  if (latestFast > latestSlow && prevFast <= prevSlow) result.conditions.push('EMA_CROSS_UP');
  if (latestFast < latestSlow && prevFast >= prevSlow) result.conditions.push('EMA_CROSS_DOWN');

  // ✅ MACD Histogram
  const macdInput = {
    values: closes,
    fastPeriod: config.MACD_FAST,
    slowPeriod: config.MACD_SLOW,
    signalPeriod: config.MACD_SIGNAL,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  };
  const macdResult = MACD.calculate(macdInput);
  const lastMACD = macdResult[macdResult.length - 1];
  if (lastMACD && lastMACD.histogram > 0) result.conditions.push('MACD_HIST_POSITIVE');
  if (lastMACD && lastMACD.histogram < 0) result.conditions.push('MACD_HIST_NEGATIVE');

  // ✅ Volume Spike
  const volumes = candles.map(c => parseFloat(c.volume));
  const avgVolume = volumes.slice(-config.VOLUME_LOOKBACK).reduce((a, b) => a + b, 0) / config.VOLUME_LOOKBACK;
  const lastVolume = volumes[volumes.length - 1];
  if (lastVolume > avgVolume * config.VOLUME_SPIKE_MULTIPLIER) result.conditions.push('VOLUME_SPIKE');

  // ✅ FIBO Proximity
  const yearly = yearHighLow[symbol];
  if (yearly && yearly.high && yearly.low && result.price) {
    const nearFibo = fibonacci.isNearFiboLevel(result.price, yearly.high, yearly.low);
    if (nearFibo) result.conditions.push('TOUCH_FIBO');
  }

  // ✅ Manual Support/Resistance Levels
  const manual = manualLevels[symbol];
  const tolerance = config.FIBO_TOLERANCE_PERCENT / 100;
  if (manual && result.price) {
    manual.support?.forEach(level => {
      const diff = Math.abs(result.price - level) / level;
      if (diff <= tolerance) result.conditions.push('TOUCH_SUPPORT');
    });
    manual.resistance?.forEach(level => {
      const diff = Math.abs(result.price - level) / level;
      if (diff <= tolerance) result.conditions.push('TOUCH_RESISTANCE');
    });
  }

  // 🔍 Лог
  logger.verbose(`[${symbol} | ${tf}] Условия: ${result.conditions.join(', ') || 'нет'} | Цена: ${result.price}`);

  return result;
}

module.exports = { calculateIndicators };
