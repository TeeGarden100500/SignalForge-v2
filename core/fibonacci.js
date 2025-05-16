// core/fibonacci.js
const config = require('../config/config');

function getFiboLevels(high, low) {
  const diff = high - low;
  return {
    '0.0%': high,
    '23.6%': high - diff * 0.236,
    '38.2%': high - diff * 0.382,
    '50.0%': high - diff * 0.5,
    '61.8%': high - diff * 0.618,
    '78.6%': high - diff * 0.786,
    '100.0%': low
  };
}

function isNearFiboLevel(price, high, low) {
  const levels = getFiboLevels(high, low);
  const tolerance = (config.FIBO_TOLERANCE_PERCENT / 100) * (high - low);

  for (const [label, level] of Object.entries(levels)) {
    if (Math.abs(price - level) <= tolerance) {
      return { match: true, level: label, value: level };
    }
  }

  return { match: false };
}

module.exports = {
  getFiboLevels,
  isNearFiboLevel
};
