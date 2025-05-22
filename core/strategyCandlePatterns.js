

function checkGreenCandle(symbol, candles, timeframe) {
  if (!candles.length) return null;

  const last = candles.at(-1);
  if (last.close > last.open) {
    return {
      symbol, timeframe,
      strategy: 'GREEN_CANDLE',
      tag: 'GREEN_CANDLE',
      message: `🟢 [${symbol}] Зеленая свеча: ${last.open} → ${last.close}`
    };
  }

  return null;
}

module.exports = { checkGreenCandle };
