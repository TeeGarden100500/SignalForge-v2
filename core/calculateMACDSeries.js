const { MACD_SETTINGS } = require('../config');
const { calculateEMA } = require('./indicators'); // убедись, что она доступна

function calculateMACDSeries(candles) {
  const { FAST_PERIOD, SLOW_PERIOD, SIGNAL_PERIOD } = MACD_SETTINGS;

  if (candles.length < SLOW_PERIOD + SIGNAL_PERIOD) return null;

  // массив цен
  const prices = candles.map(c => c.close);

  // EMA серии
  const fastEMAarr = calculateEMA(prices, FAST_PERIOD);
  const slowEMAarr = calculateEMA(prices, SLOW_PERIOD);

  // строим macdLine по разнице
  const macdLine = prices.map((_, i) => {
    const fast = fastEMAarr[i];
    const slow = slowEMAarr[i];
    if (fast == null || slow == null) return null;
    return fast - slow;
  });

  // строим сигнальную EMA от macdLine
  const macdFiltered = macdLine.map(val => ({ close: val })).filter(d => d.close != null);
  const signalArr = calculateEMA(macdFiltered.map(d => d.close), SIGNAL_PERIOD);

  // выравниваем длину сигнала до длины macdLine
  const alignedSignalArr = Array(macdLine.length - signalArr.length).fill(null).concat(signalArr);

  // собираем результат
  const macdSeries = macdLine.map((macd, i) => {
    const signal = alignedSignalArr[i];
    if (macd == null || signal == null) return null;

    return {
      macd: +macd.toFixed(4),
      signal: +signal.toFixed(4),
      histogram: +(macd - signal).toFixed(4)
    };
  });

  return macdSeries;
}

module.exports = { calculateMACDSeries };
