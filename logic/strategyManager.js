logic/strategyManager.js
const config = require('../config/config');
const { logInfo } = require('../utils/logger');
const ti = require('technicalindicators');

function runBasicIndicators(symbol, candles) {
  const closes = candles.map(c => c.close);
  const volumes = candles.map(c => c.volume);

  // RSI
  const rsi = ti.RSI.calculate({ values: closes, period: config.RSI_PERIOD });
  const lastRSI = rsi[rsi.length - 1];

  // EMA
  const emaFast = ti.EMA.calculate({ values: closes, period: config.EMA_FAST });
  const emaSlow = ti.EMA.calculate({ values: closes, period: config.EMA_SLOW });
  const lastEMAfast = emaFast[emaFast.length - 1];
  const lastEMAslow = emaSlow[emaSlow.length - 1];

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

  // Volume Spike
  const avgVol = volumes.slice(-config.VOLUME_LOOKBACK).reduce((a, b) => a + b, 0) / config.VOLUME_LOOKBACK;
  const lastVol = volumes[volumes.length - 1];
  const isVolumeSpike = lastVol > avgVol * config.VOLUME_SPIKE_MULTIPLIER;

  logInfo(`[BASIC] ${symbol} | RSI: ${lastRSI?.toFixed(2)} | EMA: ${lastEMAfast?.toFixed(2)} vs ${lastEMAslow?.toFixed(2)} | MACD: ${lastMACD?.MACD?.toFixed(4)} | Volume Spike: ${isVolumeSpike}`);
}

module.exports = {
  runBasicIndicators
};
