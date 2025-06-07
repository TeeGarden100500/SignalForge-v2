const {
  checkRSIStrategy,
  checkRSIHiddenBull,
  checkRSIVolumeFade,
  checkMACDStrategy,
  checkVolumeSpikeStrategy,
  checkEMACrossStrategy,
  checkEMAAngleStrategy,
  checkBreakoutStrategy,
  checkHighLowProximity,
  checkMeanReversionStrategy,
  checkATRSpikeStrategy,
  checkADXStrengthStrategy,
  checkFiboProximityStrategy,
  checkMACDDivergence,
  checkDojiPattern,
  checkGreenCandle,
  checkFlashCrashRecovery,
  checkStopLossHunt,
} = require('./allStrategies'); // можно объединить импорты
const { DEBUG_LOG_LEVEL } = require('../config');

function applyStrategies(symbol, candles, interval) {
  if (DEBUG_LOG_LEVEL === 'verbose') {
  console.log('[DEBUG] candles type:', typeof candles);
  console.log('[DEBUG] Array.isArray:', Array.isArray(candles));
  console.log('[DEBUG] Raw candles:', candles);
}
  const signalTags = [];
  const messages = [];
  const results = [];

  const add = (res, fallbackTag) => {
    if (res) {
      if (!res.timeframe) res.timeframe = interval; // 🟢 подставляем таймфрейм, если не указан
      signalTags.push(res.strategy || fallbackTag);
      messages.push(res.message);
      results.push(res);
    }
  };

  add(checkRSIStrategy(symbol, candles, interval), 'RSI_OVERBOUGHT');
  add(checkRSIStrategy(symbol, candles, interval), 'RSI_OVERSOLD');
  add(checkRSIStrategy(symbol, candles, interval), 'RSI_DROP');
  
  add(checkRSIHiddenBull(symbol, candles, interval), 'RSI_HIDDEN_BULL');
  checkRSIVolumeFade(symbol, candles, interval).forEach(res => add(res, 'RSI_VOLUME_FADE'));

  add(checkMACDStrategy(symbol, candles, interval), 'MACD_CROSS_UP');
  add(checkMACDStrategy(symbol, candles, interval), 'MACD_CROSS_DOWN');
  add(checkMACDDivergence(symbol, candles), 'MACD_DIVERGENCE');
  
  add(checkVolumeSpikeStrategy(symbol, candles, interval), 'VOLUME_SPIKE');
  add(checkVolumeSpikeStrategy(symbol, candles, interval), 'VOLUME_DROP');

  add(checkMeanReversionStrategy(symbol, candles, interval), 'MEAN_REVERS_UP');
  add(checkMeanReversionStrategy(symbol, candles, interval), 'MEAN_REVERS_DOWN');

  add(checkHighLowProximity(symbol, candles, interval, 'strict'), 'PROX_HIGH');
  add(checkHighLowProximity(symbol, candles, interval, 'loose'), 'PROX_LOW');

  add(checkFiboProximityStrategy(symbol, candles, interval), 'FIBO_TOUCH');
  
  add(checkEMACrossStrategy(symbol, candles, interval), 'EMA_CROSS');
  add(checkEMAAngleStrategy(symbol, candles, interval), 'EMA_ANGLE');

  add(checkDojiPattern(candles), 'DOJI');

  add(checkFlashCrashRecovery(candles, interval), 'FLASH_CRASH_RECOVERY');
  add(checkStopLossHunt(candles, interval), 'STOP_LOSS_HUNT');

  add(checkGreenCandle(symbol, candles, interval), 'GREEN_CANDLE');

  add(checkBreakoutStrategy(symbol, candles, interval), 'BREAKOUT_UP');
  add(checkBreakoutStrategy(symbol, candles, interval), 'BREAKOUT_DOWN');

  add(checkATRSpikeStrategy(symbol, candles, interval), 'ATR_SPIKE');
  
  add(checkADXStrengthStrategy(symbol, candles, interval), 'ADX_TREND');
  add(checkADXStrengthStrategy(symbol, candles, interval), 'ADX_FLAT');
  

  
  return { signalTags, messages, results };
}

module.exports = { applyStrategies };
