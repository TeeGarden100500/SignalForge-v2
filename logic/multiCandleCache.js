function handleIncomingCandle(candle) {
  const { symbol, tf: interval, time, open, high, low, close, volume } = candle;

  if (!cache[symbol]) cache[symbol] = {};
  if (!cache[symbol][interval]) cache[symbol][interval] = [];

  const entry = { openTime: time, open, high, low, close, volume, closeTime: time };
  const candles = cache[symbol][interval];

  candles.push(entry);
  if (candles.length > config.MAX_CACHE_LENGTH) candles.shift();

  if (config.DEBUG_LOG_LEVEL === 'verbose') {
    logger.verbose(`[cache] ${symbol} [${interval}] => ${candles.length} свечей`);
  }
}
