const { RSI_VOLUME_FADE } = require('../config');

module.exports = function strategyRSI_Volume_Fade({ candles, indicators, symbol, timeframe }) {
  const signals = [];

  const rsi = indicators.RSI?.[timeframe];
  const volume = indicators.volume?.[timeframe];

  if (!rsi || !volume || candles[timeframe].length < 3) return signals;

  const lastRSI = rsi[rsi.length - 1];
  const volNow = volume[volume.length - 1];
  const volPrev = volume[volume.length - 2];

  const candlePrev = candles[timeframe][candles[timeframe].length - 2];
  const candleCurr = candles[timeframe][candles[timeframe].length - 1];

  const volDrop = volPrev > 0 ? ((volPrev - volNow) / volPrev) * 100 : 0;

  // SHORT-сценарий
  if (
    lastRSI > RSI_VOLUME_FADE.RSI_HIGH_THRESHOLD &&
    volDrop >= RSI_VOLUME_FADE.VOLUME_DROP_PERCENT &&
    candleCurr.close < candlePrev.open
  ) {
    signals.push({
      type: 'short',
      strategy: 'RSI_VOLUME_FADE',
      confidence: 'medium',
      message: `Short: RSI ${lastRSI.toFixed(2)} > ${RSI_VOLUME_FADE.RSI_HIGH_THRESHOLD} и объем падает на ${volDrop.toFixed(1)}%`,
      timeframe,
      symbol
    });
  }

  // LONG-сценарий
  if (
    lastRSI < RSI_VOLUME_FADE.RSI_LOW_THRESHOLD &&
    volDrop >= RSI_VOLUME_FADE.VOLUME_DROP_PERCENT &&
    candleCurr.close > candlePrev.open
  ) {
    signals.push({
      type: 'long',
      strategy: 'RSI_VOLUME_FADE',
      confidence: 'medium',
      message: `Long: RSI ${lastRSI.toFixed(2)} < ${RSI_VOLUME_FADE.RSI_LOW_THRESHOLD} и объем падает на ${volDrop.toFixed(1)}%`,
      timeframe,
      symbol
    });
  }

  return signals;
};
