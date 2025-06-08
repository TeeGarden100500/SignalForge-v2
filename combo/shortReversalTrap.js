const { calculateRSI, calculateEMA } = require('../core/indicators');

function confirmShortReversalTrap({ candles, signals }) {
  if (!Array.isArray(candles) || candles.length < 2) return false;

  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];
  const body = Math.abs(last.close - last.open) || 1;
  const range = last.high - last.low || 1;

  let confirmations = 0;

  // WICK_REJECTION or STOP_LOSS_HUNT filter
  if (signals.includes('WICK_REJECTION') || signals.includes('STOP_LOSS_HUNT')) {
    const upperWick = last.high - Math.max(last.close, last.open);
    if (upperWick > body * 2.5 && last.close < last.high - range * 0.5) {
      confirmations++;
    }
  }

  // VOLUME_TRAP confirmation
  if (signals.includes('VOLUME_TRAP')) {
    const spikeMid = prev.low + (prev.high - prev.low) / 2;
    if (last.close < last.open && last.close < spikeMid) {
      confirmations++;
    }
  }

  // RSI_OVERBOUGHT stronger condition
  if (signals.includes('RSI_OVERBOUGHT')) {
    const rsi = calculateRSI(candles);
    const rsiPrev = calculateRSI(candles.slice(0, -1));
    if (rsi > 75 || (rsiPrev && rsiPrev > 75 && rsi < rsiPrev)) {
      confirmations++;
    }
  }

  // structural filter against strong uptrend
  const prices = candles.map(c => c.close);
  const ema7 = calculateEMA(prices, 7).at(-1);
  const ema25 = calculateEMA(prices, 25).at(-1);
  const ema99 = calculateEMA(prices, 99).at(-1);
  let structuralInvalid = false;
  if (ema7 && ema25 && ema99 && candles.length > 6) {
    const prevHigh = Math.max(...candles.slice(-6, -1).map(c => c.high));
    if (last.high >= prevHigh && ema7 > ema25 && ema25 > ema99) {
      structuralInvalid = true;
    }
  }

  return confirmations > 0 && !structuralInvalid;
}

module.exports = { confirmShortReversalTrap };
