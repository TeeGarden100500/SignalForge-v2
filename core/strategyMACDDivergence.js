const { calculateMACDSeries } = require('./calculateMACDSeries');

function checkMACDDivergence(symbol, candles, timeframe) {
  const macdSeries = calculateMACDSeries(candles);

  if (!macdSeries || macdSeries.length < 2) {
    console.log(`[DEBUG] MACD Divergence: Недостаточно данных для ${symbol}`);
    return null;
  }

  const current = macdSeries.at(-1);
  const prev = macdSeries.at(-2);

  console.log(`[DEBUG] MACD Divergence: ${symbol}`, {
    prevMACD: prev.macd,
    currMACD: current.macd,
    prevPrice: candles.at(-2)?.close,
    currPrice: candles.at(-1)?.close,
  });

  if (
    current.macd > prev.macd &&                  // MACD идёт вверх
    candles.at(-1).close < candles.at(-2).close  // А цена идёт вниз
  ) {
    return {
      symbol,
      timeframe,
      strategy: 'MACD_DIVERGENCE',
      tag: 'MACD_DIVERGENCE',
      message: `📉 [${symbol}] Медвежья дивергенция MACD: цена падает, MACD растёт — возможен разворот вниз`,
    };
  }

  return null;
}
