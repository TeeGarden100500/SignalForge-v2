const { calculateMACD } = require('./indicators');

function checkMACDDivergence(symbol, candles) {
  if (candles.length < 5) return null;

  const priceNow = candles.at(-1).close;
  const pricePrev = candles.at(-4).close;

  const { macd: macdNow } = calculateMACD(candles.slice(-2));
  const { macd: macdPrev } = calculateMACD(candles.slice(-5, -3));

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
