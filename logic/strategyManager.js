// logic/strategyManager.js
const config = require('../config/config');
const { logInfo } = require('../utils/logger');
const ti = require('technicalindicators');
const { evaluateComboStrategies } = require('./comboSignalEngine');

function runBasicIndicators(symbol, candles) {
  const closes = candles.map(c => c.close);
  const volumes = candles.map(c => c.volume);

  const context = {
    symbol,
    timeframe: config.TIMEFRAMES.LEVEL_1,
    price: closes[closes.length - 1],
    conditions: []
  };

  // RSI
  const rsi = ti.RSI.calculate({ values: closes, period: config.RSI_PERIOD });
  const lastRSI = rsi[rsi.length - 1];
  if (lastRSI !== undefined) {
    if (lastRSI < config.RSI_LOW) context.conditions.push('RSI_LOW');
    if (lastRSI > config.RSI_HIGH) context.conditions.push('RSI_HIGH');
  }

  // EMA
  const emaFast = ti.EMA.calculate({ values: closes, period: config.EMA_FAST });
  const emaSlow = ti.EMA.calculate({ values: closes, period: config.EMA_SLOW });
  const lastEMAfast = emaFast[emaFast.length - 1];
  const lastEMAslow = emaSlow[emaSlow.length - 1];
  if (lastEMAfast > lastEMAslow) context.conditions.push('EMA_CROSS_UP');
  if (lastEMAfast < lastEMAslow) context.conditions.push('EMA_CROSS_DOWN');

  // MACD
  const macd = ti.MACD.calculate({
    values: closes,
    fastPeriod: config.MACD_FAST,
    slowPeriod: config.MACD_SLOW,
    signalPeriod: config.MACD_SIGNAL,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  });
  const lastMACD = macd[macd.length - 1];
  if (lastMACD?.histogram > 0) context.conditions.push('MACD_HIST_FLIP');

  // Volume Spike
  const avgVol = volumes.slice(-config.VOLUME_LOOKBACK).reduce((a, b) => a + b, 0) / config.VOLUME_LOOKBACK;
  const lastVol = volumes[volumes.length - 1];
  if (lastVol > avgVol * config.VOLUME_SPIKE_MULTIPLIER) context.conditions.push('VOLUME_SPIKE');

  logInfo(`[BASIC] ${symbol} | RSI: ${lastRSI?.toFixed(2)} | EMA: ${lastEMAfast?.toFixed(2)} vs ${lastEMAslow?.toFixed(2)} | MACD: ${lastMACD?.MACD?.toFixed(4)} | Условия: ${context.conditions.join(', ')}`);

  evaluateComboStrategies(context);
}

module.exports = {
  runBasicIndicators
};
