// 📈 breakoutDetector.js — логика пробоя уровней сопротивления и поддержки

function checkBreakout(candles, levels = [], type = 'resistance', tolerancePercent = 0.3) {
  if (candles.length < 2) return [];

  const prev = candles[candles.length - 2];
  const curr = candles[candles.length - 1];

  const results = [];

  levels.forEach(level => {
    const tolerance = level * (tolerancePercent / 100);
    const adjustedLevel = parseFloat(level);

    if (type === 'resistance') {
      const isBreakout = prev.close < adjustedLevel - tolerance && curr.close > adjustedLevel + tolerance;
      if (isBreakout) results.push({ level: adjustedLevel, type: 'BREAKOUT_RESISTANCE' });
    }

    if (type === 'support') {
      const isBreakdown = prev.close > adjustedLevel + tolerance && curr.close < adjustedLevel - tolerance;
      if (isBreakdown) results.push({ level: adjustedLevel, type: 'BREAKDOWN_SUPPORT' });
    }
  });

  return results;
}

module.exports = { checkBreakout };
