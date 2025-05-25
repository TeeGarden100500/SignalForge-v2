// Новый расчет MACD-серии для анализа дивергенций и истории
const { EMA_SETTINGS, MACD_SETTINGS } = require('../config');
const { calculateEMA } = require('./indicators');

function calculateMACDSeries(candles) {
  const { FAST_PERIOD, SLOW_PERIOD, SIGNAL_PERIOD } = MACD_SETTINGS;

  if (!Array.isArray(candles) || candles.length < SLOW_PERIOD + SIGNAL_PERIOD + 1) return null;

  const macdLineArr = [];

  for (let i = 0; i < candles.length; i++) {
    const slice = candles.slice(0, i + 1);
    const fastEMA = calculateEMA(slice.map(c => c.close), FAST_PERIOD);
    const slowEMA = calculateEMA(slice.map(c => c.close), SLOW_PERIOD);

    if (fastEMA != null && slowEMA != null) {
      const macd = +(fastEMA.at(-1) - slowEMA.at(-1)).toFixed(6);
      macdLineArr.push(macd);
    } else {
      macdLineArr.push(null); // Для выравнивания индексов
    }
  }

  // Теперь считаем сигнальную EMA от macdLineArr
  const signalArr = calculateEMA(macdLineArr, SIGNAL_PERIOD);
  const result = [];

  for (let i = 0; i < macdLineArr.length; i++) {
    if (macdLineArr[i] == null || signalArr[i] == null) {
      result.push(null);
    } else {
      result.push({
        macd: macdLineArr[i],
        signal: signalArr[i],
        histogram: +(macdLineArr[i] - signalArr[i]).toFixed(6),
      });
    }
  }

  return result;
}

module.exports = { calculateMACDSeries };
