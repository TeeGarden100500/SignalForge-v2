const { calculateRSI } = require('./indicators');

function checkRSIHiddenBull(symbol, candles) {
  // Примерная логика: последние 2 RSI показывают рост, а цена — падение (дивергенция)
  if (candles.length < 5) return null;

  const rsi1 = calculateRSI(candles.slice(-3)); // предпоследняя точка
  const rsi2 = calculateRSI(candles.slice(-2)); // последняя точка

  const price1 = candles.at(-3).close;
  const price2 = candles.at(-1).close;

  if (rsi1 && rsi2 && rsi1 < rsi2 && price1 > price2) {
    return {
      symbol,
      strategy: 'RSI_HIDDEN_BULL',
      tag: 'RSI_HIDDEN_BULL',
      message: `🟢 [${symbol}] Hidden Bullish RSI: цена падает, RSI растет — возможный разворот вверх`
    };
  }

  return null;
}

module.exports = { checkRSIHiddenBull };
