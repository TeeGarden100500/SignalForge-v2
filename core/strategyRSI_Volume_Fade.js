const { RSI_VOLUME_FADE } = require('../config');

function checkRSIVolumeFade(symbol, candles, interval) {
  const signals = [];

  for (const timeframe of RSI_VOLUME_FADE.TIMEFRAMES) {
    const rsi = candles.indicators?.RSI?.[timeframe];
    const volume = candles.indicators?.volume?.[timeframe];
    const tfCandles = candles?.[timeframe];

    if (!rsi || !volume || !tfCandles || tfCandles.length < 3) continue;

    const lastRSI = rsi[rsi.length - 1];
    const volNow = volume[volume.length - 1];
    const volPrev = volume[volume.length - 2];

    const candlePrev = tfCandles[tfCandles.length - 2];
    const candleCurr = tfCandles[tfCandles.length - 1];

    const volDrop = volPrev > 0 ? ((volPrev - volNow) / volPrev) * 100 : 0;

    // SHORT
    if (
      lastRSI > RSI_VOLUME_FADE.RSI_HIGH_THRESHOLD &&
      volDrop >= RSI_VOLUME_FADE.VOLUME_DROP_PERCENT &&
      candleCurr.close < candlePrev.open
    ) {
      signals.push({
        type: 'short',
        strategy: 'RSI_VOLUME_FADE',
        confidence: 'medium',
        message: `Short: RSI ${lastRSI.toFixed(2)} > ${RSI_VOLUME_FADE.RSI_HIGH_THRESHOLD}, объем упал на ${volDrop.toFixed(1)}%`,
        timeframe,
        symbol
      });
    }

    // LONG
    if (
      lastRSI < RSI_VOLUME_FADE.RSI_LOW_THRESHOLD &&
      volDrop >= RSI_VOLUME_FADE.VOLUME_DROP_PERCENT &&
      candleCurr.close > candlePrev.open
    ) {
      signals.push({
        type: 'long',
        strategy: 'RSI_VOLUME_FADE',
        confidence: 'medium',
        message: `Long: RSI ${lastRSI.toFixed(2)} < ${RSI_VOLUME_FADE.RSI_LOW_THRESHOLD}, объем упал на ${volDrop.toFixed(1)}%`,
        timeframe,
        symbol
      });
    }
  }

  return signals;
}

module.exports = checkRSIVolumeFade;
