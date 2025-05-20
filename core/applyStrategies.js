const {
  checkRSIStrategy,
  checkMACDStrategy,
  checkVolumeSpikeStrategy,
  checkEMACrossoverStrategy,
  checkEMAAngleStrategy,
  checkBreakoutStrategy,
  checkHighLowProximity,
  checkMeanReversionStrategy,
  checkATRSpikeStrategy,
  checkADXStrengthStrategy,
  checkFiboProximityStrategy,
  checkDojiPattern,
  checkRSIHiddenBull,
  checkMACDDivergence,
  checkDojiStrategy,
  
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
  add(checkRSIHiddenBull(symbol, candles), 'RSI_HIDDEN_BULL');
  add(checkMACDStrategy(symbol, candles, interval), 'MACD');
  add(checkVolumeSpikeStrategy(symbol, candles, interval), 'VOLUME_SPIKE');
  add(checkEMACrossoverStrategy(symbol, candles, interval), 'EMA_CROSS');
  add(checkEMAAngleStrategy(symbol, candles, interval), 'EMA_ANGLE');

  add(checkHighLowProximity(symbol, candles, interval, 'strict'), 'PROX_HIGH');
  add(checkHighLowProximity(symbol, candles, interval, 'loose'), 'PROX_HIGH_L');

  add(checkMeanReversionStrategy(symbol, candles, interval), 'MEAN_REVERS_UP');
  add(checkATRSpikeStrategy(symbol, candles, interval), 'ATR_SPIKE');
  add(checkADXStrengthStrategy(symbol, candles, interval), 'ADX_TREND');
  add(checkFiboProximityStrategy(symbol, candles, interval), 'FIBO_TOUCH');
  add(checkMACDDivergence(symbol, candles), 'MACD_DIVERGENCE');
  add(checkDojiStrategy(symbol, candles, interval), 'DOJI');
  add(checkBreakoutStrategy(symbol, candles), 'BREAKOUT');

  

  return { signalTags, messages, results };
}

module.exports = { applyStrategies };
