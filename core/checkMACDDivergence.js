const { calculateMACDSeries } = require('./calculateMACDSeries');

function checkMACDDivergence(symbol, candles) {
  const macdSeries = calculateMACDSeries(candles);
  if (!Array.isArray(macdSeries)) {
    console.log('[DEBUG] MACD Divergence: macdSeries is not an array');
    return null;
  }

  const validMACD = macdSeries.filter(x => x && x.macd != null && x.signal != null);
  console.log('[DEBUG] Valid MACD length:', validMACD.length);

  if (validMACD.length < 5) {
    console.log('[DEBUG] MACD Divergence: Недостаточно данных для', symbol);
    return null;
  }

  const prevMACD = validMACD.at(-5);
  const currMACD = validMACD.at(-1);
  const prevPrice = candles.at(-5)?.close;
  const currPrice = candles.at(-1)?.close;

  console.log('[DEBUG] MACD Divergence:', symbol, {
    prevMACD, currMACD, prevPrice, currPrice
  });

  if (!prevMACD || !currMACD || prevPrice == null || currPrice == null) {
    console.log('[DEBUG] MACD Divergence: Не удалось получить значения для анализа');
    return null;
  }

  const macdRising = currMACD.macd > prevMACD.macd;
  const priceFalling = currPrice < prevPrice;

  if (priceFalling && macdRising) {
    return {
      symbol,
      strategy: 'MACD_DIVERGENCE',
      tag: 'MACD_DIVERGENCE',
      message: `🔄 [${symbol}] MACD Divergence: цена падает, MACD растёт — возможен разворот`
    };
  }

  return null;
}

module.exports = { checkMACDDivergence };