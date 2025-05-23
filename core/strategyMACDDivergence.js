const { calculateMACD } = require('./indicators');
const { DEBUG_LOG_LEVEL } = require('../config');

function checkMACDDivergence(symbol, candles, timeframe) {
  if (!Array.isArray(candles) || candles.length < 5) return null;

  const priceNow = candles.at(-1).close;
  const pricePrev = candles.at(-4).close;

  const macdSeries = calculateMACD(candles);
  if (!Array.isArray(macdSeries) || macdSeries.length < 2) {
    if (DEBUG_LOG_LEVEL === 'verbose') {
    console.log(`[DEBUG] MACD Divergence: недостаточно данных для ${symbol}`);
    }
    return null;
    }

  const macdPrev = macdSeries.at(-2).macd;
  const macdNow = macdSeries.at(-1).macd;

  if (priceNow < pricePrev && macdNow > macdPrev) {
    return {
      symbol, timeframe,
      strategy: 'MACD_DIVERGENCE',
      tag: 'MACD_DIVERGENCE',
      message: `🟢 [${symbol}] MACD Дивергенция: цена падает, MACD растет — возможный отскок`
    };
    }

  if (priceNow > pricePrev && macdNow < macdPrev) {
    return {
      symbol, timeframe,
      strategy: 'MACD_DIVERGENCE',
      tag: 'MACD_DIVERGENCE',
      message: `🔴 [${symbol}] MACD Дивергенция: цена растет, MACD падает — возможный разворот вниз`
    };
    }

 return null;
    }

module.exports = { checkMACDDivergence };
  
