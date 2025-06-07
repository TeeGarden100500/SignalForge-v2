const LOOKBACK = 5; // number of previous candles to define range

function checkStopLossHunt(candles, timeframe) {
  if (!Array.isArray(candles) || candles.length <= LOOKBACK) return null;

  const last = candles.at(-1);
  const prev = candles.slice(-LOOKBACK - 1, -1);
  const highRange = Math.max(...prev.map(c => c.high));
  const lowRange = Math.min(...prev.map(c => c.low));

  const bodySize = Math.abs(last.close - last.open);
  if (bodySize === 0) return null;

  const upperWick = last.high - Math.max(last.close, last.open);
  const lowerWick = Math.min(last.close, last.open) - last.low;

  const upperRatio = upperWick / bodySize;
  const lowerRatio = lowerWick / bodySize;

  const piercedHigh = last.high > highRange && last.close <= highRange && upperRatio >= 2.5;
  const piercedLow = last.low < lowRange && last.close >= lowRange && lowerRatio >= 2.5;

  if (piercedHigh || piercedLow) {
    return {
      timeframe,
      strategy: 'STOP_LOSS_HUNT',
      tag: 'STOP_LOSS_HUNT',
      message: `\uD83D\uDD2A StopLossHunt: свеча с выносом ликвидности и возвратом внутрь диапазона. Возможен резкий откат.`
    };
  }

  return null;
}

module.exports = { checkStopLossHunt };
