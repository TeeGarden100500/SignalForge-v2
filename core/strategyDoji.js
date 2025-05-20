function checkDojiPattern(candles) {
  if (!Array.isArray(candles) || candles.length < 3) return null;

  const lastCandle = candles.at(-1);
  const body = Math.abs(lastCandle.open - lastCandle.close);
  const range = lastCandle.high - lastCandle.low;

  const isDoji = body / range < 0.1;

  if (isDoji) {
    return {
      strategy: 'DOJI',
      tag: 'DOJI',
      message: `📌 [DOJI] Найден разворотный паттерн Doji`
    };
  }

  return null;
}

module.exports = { checkDojiPattern };
