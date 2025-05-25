// core/indicators.js (или новый файл, если хочешь изолировать)

const { FAST_PERIOD, SLOW_PERIOD, SIGNAL_PERIOD } = require('../config').MACD_SETTINGS;
const { calculateEMA } = require('./indicators');

function calculateMACDSeries(candles) {
  const macdLineArr = [];

  for (let i = 0; i < candles.length; i++) {
    const slice = candles.slice(0, i + 1);

    if (slice.length < Math.max(FAST_PERIOD, SLOW_PERIOD) + 1) {
      macdLineArr.push(null);
      continue;
    }

    const fastEMA = calculateEMA(slice, FAST_PERIOD);
    const slowEMA = calculateEMA(slice, SLOW_PERIOD);

    const fast = fastEMA?.at(-1);
    const slow = slowEMA?.at(-1);

    if (fast == null || slow == null) {
      macdLineArr.push(null);
    } else {
      macdLineArr.push(fast - slow);
    }
  }

  // Построим сигнальную EMA только по валидным значениям
  const macdSeries = macdLineArr.map((v) => (v == null ? null : { macd: v }));

  return macdSeries;
}

module.exports = { calculateMACDSeries };
