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

module.exports = { checkDojiPattern };
