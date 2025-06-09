const { MACD_MIN_SIGNAL, DEBUG_LOG_LEVEL, STRATEGY_REQUIREMENTS } = require('../config');
const { hasEnoughCandles } = require('../utils/candleValidator');
const { calculateMACDSeries } = require('./calculateMACDSeries');
const { logVerbose } = require('../utils/logger');

function checkMACDDivergence(symbol, candles, timeframe) {
  const minRequiredCandles = STRATEGY_REQUIREMENTS.MACD_DIVERGENCE || 60;
  if (!hasEnoughCandles(candles, minRequiredCandles, 'MACD_DIVERGENCE')) return null;

  const macdSeries = calculateMACDSeries(candles);
  const validSeries = macdSeries.filter(entry => entry && entry.macd !== null && entry.signal !== null);
  const lastIndex = validSeries.length - 1;

  if (validSeries.length < 2) {
    if (DEBUG_LOG_LEVEL === 'verbose') {
      logVerbose('[DEBUG] MACD Divergence: Недостаточно данных для расчета');
    }
    return null;
  }

  const prevMACD = validSeries[lastIndex - 1];
  const currMACD = validSeries[lastIndex];

  const prevPrice = candles.at(-2)?.close;
  const currPrice = candles.at(-1)?.close;

  // Защита от пустых данных
  if (!prevMACD || !currMACD || !prevPrice || !currPrice) {
    return null;
  }

  // Слишком слабый сигнал — гистограмма почти 0
  const histogramStrength = Math.abs(currMACD.histogram);
  if (histogramStrength < MACD_MIN_SIGNAL) {
    if (DEBUG_LOG_LEVEL === 'verbose') {
      logVerbose(`[DEBUG] MACD Divergence: Сигнал слишком слабый (hist=${currMACD.histogram}) для ${symbol}`);
    }
    return null;
  }

  // Условия дивергенций
  let type = null;
  if (currPrice > prevPrice && currMACD.macd < prevMACD.macd) {
    type = 'hidden_bear'; // Скрытая медвежья дивергенция
  } else if (currPrice < prevPrice && currMACD.macd > prevMACD.macd) {
    type = 'classic_bull'; // Классическая бычья дивергенция
  }

  if (!type) return null;

  const message = `📉 [${symbol}] MACD Divergence [${type.toUpperCase()}] на ${timeframe}:
  Цена: ${prevPrice} → ${currPrice}
  MACD: ${prevMACD.macd.toFixed(4)} → ${currMACD.macd.toFixed(4)}
  Гистограмма: ${currMACD.histogram.toFixed(4)}`;

  return {
    symbol,
    strategy: 'MACD_DIVERGENCE',
    tag: 'MACD_DIVERGENCE',
    timeframe,
    type,
    message,
  };
}

module.exports = { checkMACDDivergence };
