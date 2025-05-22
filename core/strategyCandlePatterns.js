

function checkGreenCandle(symbol, candles, timeframe) {
  if (!candles.length) return null;

  const last = candles.at(-1);
  if (last.close > last.open) {
    return {
      symbol,
      strategy: 'GREEN_CANDLE',
      tag: 'GREEN_CANDLE',
      timeframe,
      message: `🟢 [${symbol}] Зеленая свеча: ${last.open} → ${last.close}`
    };
  }

  return null;
}

module.exports = { checkGreenCandle };
