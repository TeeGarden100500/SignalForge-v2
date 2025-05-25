const { calculateMACDSeries } = require('../core/calculateMACDSeries');

function checkMACDDivergence(candles, interval, symbol) {
  const macdSeries = calculateMACDSeries(candles);

  if (!Array.isArray(macdSeries) || macdSeries.length < 2) return null;

  const latest = macdSeries.at(-1);
  const previous = macdSeries.at(-2);

  if (!latest || !previous) return null;

  const isBullishDivergence = previous.macd < previous.signal && latest.macd > latest.signal;
  const isBearishDivergence = previous.macd > previous.signal && latest.macd < latest.signal;

  if (isBullishDivergence) {
    return {
      strategy: 'MACD_DIVERGENCE',
      signal: 'buy',
      strength: 'medium',
      interval,
      symbol,
      message: `MACD bullish divergence on ${symbol} (${interval})`,
    };
  }

  if (isBearishDivergence) {
    return {
      strategy: 'MACD_DIVERGENCE',
      signal: 'sell',
      strength: 'medium',
      interval,
      symbol,
      message: `MACD bearish divergence on ${symbol} (${interval})`,
    };
  }

  return null;
}

module.exports = { checkMACDDivergence };
