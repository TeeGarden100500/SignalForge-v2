const {
  checkRSIStrategy,
  checkRSIHiddenBull,
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
  
} = require('./allStrategies'); // можно объединить импорты

function applyStrategies(symbol, candles, interval) {
//  console.log('[DEBUG] candles type:', typeof candles);
//  console.log('[DEBUG] Array.isArray:', Array.isArray(candles));
//  console.log('[DEBUG] Raw candles:', candles);
  const signalTags = [];
  const messages = [];
  const results = [];

  const add = (res, fallbackTag) => {
    if (res) {
      signalTags.push(res.strategy || fallbackTag);
      messages.push(res.message);
      results.push(res);
    }
  };

  add(checkRSIStrategy(symbol, candles), 'RSI_OVERBOUGHT');
  add(checkRSIStrategy(symbol, candles), 'RSI_OVERSOLD');
  add(checkRSIStrategy(symbol, candles), 'RSI_DROP');
  add(checkRSIHiddenBull(symbol, candles), 'RSI_HIDDEN_BULL'); 
  
  add(checkMACDStrategy(symbol, candles, interval), 'MACD_CROSS_UP');
  add(checkMACDStrategy(symbol, candles, interval), 'MACD_CROSS_DOWN');
  add(checkMACDStrategy(symbol, candles, interval), 'MACD_DIVERGENCE');
  add(checkMACDDivergence(symbol, candles), 'MACD_DIVERGENCE');
  
  add(checkVolumeSpikeStrategy(symbol, candles, interval), 'VOLUME_SPIKE');
  add(checkVolumeSpikeStrategy(symbol, candles, interval), 'VOLUME_DROP');

  add(strategies.checkMeanReversionStrategy(symbol, candles, interval), 'MEAN_REVERS_UP');
  add(strategies.checkMeanReversionStrategy(symbol, candles, interval), 'MEAN_REVERS_DOWN');

  add(checkHighLowProximity(symbol, candles, interval, 'strict'), 'PROX_HIGH');
  add(checkHighLowProximity(symbol, candles, interval, 'loose'), 'PROX_LOW');

  add(checkFiboProximityStrategy(symbol, candles, interval), 'FIBO_TOUCH');
  
  add(checkEMACrossStrategy(symbol, candles, interval), 'EMA_CROSS');
  add(checkEMAAngleStrategy(symbol, candles, interval), 'EMA_ANGLE');

  add(checkDojiPattern(candles), 'DOJI');

  add(checkGreenCandle(symbol, candles), 'GREEN_CANDLE');

  add(checkBreakoutStrategy(symbol, candles), 'BREAKOUT_UP');
  add(checkBreakoutStrategy(symbol, candles), 'BREAKOUT_DOWN');

  add(checkATRSpikeStrategy(symbol, candles, interval), 'ATR_SPIKE');
  
  add(checkADXStrengthStrategy(symbol, candles, interval), 'ADX_TREND');
  add(checkADXStrengthStrategy(symbol, candles, interval), 'ADX_FLAT');

  
  return { signalTags, messages, results };
}

module.exports = { applyStrategies };
