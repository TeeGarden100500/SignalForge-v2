const { calculateMACD } = require('./indicators');

function checkMACDDivergence(symbol, candles) {
  if (candles.length < 5) return null;

  const priceNow = candles.at(-1).close;
  const pricePrev = candles.at(-4).close;

  const macdSeries = calculateMACD(candles);
if (!Array.isArray(macdSeries) || macdSeries.length < 2) {
  console.log(`[DEBUG] MACD Divergence: недостаточно данных для ${symbol}`);
  return null;
}

const macdPrev = macdSeries.at(-2).macd;
const macdNow = macdSeries.at(-1).macd;

  if (priceNow < pricePrev && macdNow > macdPrev) {
    return {
      symbol,
      strategy: 'MACD_DIVERGENCE',
      tag: 'MACD_DIVERGENCE',
      message: `🟢 [${symbol}] MACD Дивергенция: цена падает, MACD растет — возможный отскок`
    };
  }

  return null;
}

module.exports = { checkMACDDivergence };
