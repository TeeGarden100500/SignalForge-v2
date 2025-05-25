const { calculateEMA } = require('./indicators');
const { FAST_PERIOD, SLOW_PERIOD } = require('../config').MACD_SETTINGS;

function calculateMACDSeries(candles) {
  const macdLineArr = [];

  for (let i = 0; i < candles.length; i++) {
    const slice = candles.slice(0, i + 1);

    if (slice.length < SLOW_PERIOD) {
      macdLineArr.push(null);
      continue;
    }

    const fastEMA = calculateEMA(slice.map(c => c.close), FAST_PERIOD).at(-1);
    const slowEMA = calculateEMA(slice.map(c => c.close), SLOW_PERIOD).at(-1);

    if (fastEMA == null || slowEMA == null) {
      macdLineArr.push(null);
      continue;
    }

    macdLineArr.push(fastEMA - slowEMA);
  }

  return macdLineArr;
}

module.exports = calculateMACDSeries;
