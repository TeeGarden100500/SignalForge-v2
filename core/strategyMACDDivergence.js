const { calculateMACDSeries } = require('./calculateMACDSeries.js');

function checkMACDDivergence(symbol, candles, timeframe) {
  const macdSeries = calculateMACDSeries(candles);
  if (!macdSeries || macdSeries.length < 5) return null;

  const priceNow = candles.at(-1).close;
  const pricePrev = candles.at(-4).close;

  const macdNow = macdSeries.at(-1);
  const macdPrev = macdSeries.at(-4);

  if (macdNow == null || macdPrev == null) return null;

  if (priceNow < pricePrev && macdNow > macdPrev) {
    return {
      symbol,
      timeframe,
      strategy: 'MACD_DIVERGENCE',
      tag: 'MACD_DIVERGENCE',
      message: `🟢 [${symbol}] MACD Дивергенция: цена падает, MACD растет — возможный отскок`,
    };
  }

  if (priceNow > pricePrev && macdNow < macdPrev) {
    return {
      symbol,
      timeframe,
      strategy: 'MACD_DIVERGENCE',
      tag: 'MACD_DIVERGENCE',
      message: `🔴 [${symbol}] MACD Дивергенция: цена растет, MACD падает — возможный разворот вниз`,
    };
  }

  return null;
}

module.exports = { checkMACDDivergence };
