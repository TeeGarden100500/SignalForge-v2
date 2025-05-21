const { calculateRSI } = require('./indicators');

function checkRSIHiddenBull(symbol, candles) {
  if (candles.length < 5) return null;

  const rsiPeriod = 14;
  const closePrices = candles.map(c => c.close);
 const rsi = Array.isArray(calculateRSI(closePrices, rsiPeriod))
  ? calculateRSI(closePrices, rsiPeriod)
  : Array(20).fill(calculateRSI(closePrices, rsiPeriod));

  if (!rsi || rsi.length < 5) return null;

  const priceNow = candles.at(-1).close;
  const pricePrev = candles.at(-4).close;
  const rsiNow = rsi.at(-1);
  const rsiPrev = rsi.at(-4);

  // Условие скрытой бычьей дивергенции: цена падает, RSI растёт
  if (priceNow < pricePrev && rsiNow > rsiPrev) {
    return {
      symbol,
      strategy: 'RSI_HIDDEN_BULL',
      tag: 'RSI_HIDDEN_BULL',
      message: `🟢 [${symbol}] Скрытая бычья дивергенция: цена снижается, RSI растёт — возможен рост`
    };
  }

  return null;
}

module.exports = { checkRSIHiddenBull };
