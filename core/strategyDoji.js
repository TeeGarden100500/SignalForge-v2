function checkDojiPattern(candles) {
  const last = candles[candles.length - 1];
  const body = Math.abs(last.open - last.close);
  const range = last.high - last.low;

  if (range === 0) return null;

  const bodyRatio = body / range;

  if (bodyRatio < 0.1) {
    return {
      tag: 'DOJI',
      strategy: 'DOJI',
      message: `⚠️ DOJI: Найдена свеча неопределённости (bodyRatio: ${bodyRatio.toFixed(2)})`
    };
  }

return null;
}

function checkDojiStrategy(symbol, candles, interval) {
  if (!Array.isArray(candles) || candles.length < 1) return null;

  const last = candles[candles.length - 1];
  const bodySize = Math.abs(last.open - last.close);
  const candleRange = last.high - last.low;

  const bodyRatio = bodySize / candleRange;

  if (bodyRatio < 0.1) {
    return {
      symbol,
      strategy: 'DOJI_DETECTOR',
      tag: 'DOJI',
      message: `⚠️ [${symbol}] Свеча Doji: тело = ${bodySize.toFixed(4)} (${(bodyRatio * 100).toFixed(1)}%)`
    };
  }

  return null;
}

module.exports = { 
checkDojiPattern, 
checkDojiStrategy,                 
};
