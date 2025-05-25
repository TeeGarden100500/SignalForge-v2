const { calculateMACDSeries } = require('./calculateMACDSeries');

function checkMACDDivergence(symbol, candles, timeframe) {
  if (!Array.isArray(candles) || candles.length < 30) return null;
  
  const macdSeries = calculateMACDSeries(candles);
  console.log('[DEBUG] MACD Series:', macdSeries);

  if (!macdSeries || macdSeries.length < 6) return null;
    console.log(`[DEBUG] MACD Divergence: Недостаточно данных для ${symbol}`);
    return null;


    const curr = macdSeries.at(-1);
    const prev = macdSeries.at(-5);
    const currPrice = candles.at(-1)?.close;
    const prevPrice = candles.at(-5)?.close;

 // Проверка: все данные валидны
  if (!curr || !prev || currPrice == null || prevPrice == null) return null;

// Условие бычьей скрытой дивергенции: цена падает, MACD растёт
    const isHiddenBullish = prevPrice > currPrice && prev.macd < curr.macd;

  if (isHiddenBullish) {
    return {
      symbol,
      strategy: 'MACD_DIVERGENCE',
      tag: 'MACD_DIVERGENCE',
      timeframe,
      message: `🟢 [${symbol}] MACD дивергенция: цена падает, MACD растёт — возможен разворот вверх`
    };
  }

  return null;
}
module.exports = { checkMACDDivergence };
