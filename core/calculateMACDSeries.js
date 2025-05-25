
const { MACD_SETTINGS } = require('../config');
const { calculateEMA } = require('./indicators');


function calculateMACDSeries(candles) {
  const { FAST_PERIOD, SLOW_PERIOD, SIGNAL_PERIOD } = MACD_SETTINGS;

  const macdLineArr = [];

  for (let i = 0; i < candles.length; i++) {
    const slice = candles.slice(0, i + 1);
    if (slice.length < SLOW_PERIOD) {
      macdLineArr.push(null);
      continue;
    }
    const fastEMA = calculateEMA(slice, FAST_PERIOD)?.at(-1);
    const slowEMA = calculateEMA(slice, SLOW_PERIOD)?.at(-1);

    if (fastEMA != null && slowEMA != null) {
      macdLineArr.push(fastEMA - slowEMA);
    } else {
      macdLineArr.push(null);
    }
  }

  return macdLineArr;
}

module.exports.calculateMACDSeries = calculateMACDSeries;
