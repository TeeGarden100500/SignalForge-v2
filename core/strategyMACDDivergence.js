const { calculateMACDSeries } = require('./calculateMACDSeries.js');

function checkMACDDivergence(symbol, candles, timeframe) {
  const macdSeries = calculateMACDSeries(candles);
  if (!Array.isArray(macdSeries) || macdSeries.length < 3) {
    console.log(`[DEBUG] MACD Divergence: недостаточно данных для ${symbol}`);
    return null;
  }

  const lastThree = macdSeries.slice(-3);
  const [macd1, macd2, macd3] = lastThree.map(v => v?.macd);
  const [c1, c2, c3] = candles.slice(-3);

  if ([macd1, macd2, macd3].some(v => typeof v !== 'number')) {
    console.log(`[DEBUG] MACD Divergence: null значения в последних точках для ${symbol}`);
    return null;
  }

  const priceNow = c3.close;
  const pricePrev = c1.close;

  // Обратная дивергенция: цена падает, MACD растёт
  if (priceNow < pricePrev && macd3 > macd1) {
    return {
      symbol,
      timeframe,
      strategy: 'MACD_DIVERGENCE',
      tag: 'MACD_DIVERGENCE',
      message: `🟢 [${symbol}] MACD Дивергенция: цена падает, MACD растёт — возможный отскок`
    };
  }

  // Прямая дивергенция: цена растёт, MACD падает
  if (priceNow > pricePrev && macd3 < macd1) {
    return {
      symbol,
      timeframe,
      strategy: 'MACD_DIVERGENCE',
      tag: 'MACD_DIVERGENCE',
      message: `🔴 [${symbol}] MACD Дивергенция: цена растёт, MACD падает — возможный разворот вниз`
    };
  }

  return null;
}

module.exports = { checkMACDDivergence };
