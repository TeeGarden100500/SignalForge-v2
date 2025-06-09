// Utility to estimate safe leverage and position size based on liquidity

const EXCHANGE_LIMIT = {
  BTCUSDT: 125,
  ETHUSDT: 75,
  default: 25
};

function estimateSafeLeverage(symbol, depositUSD, avg1mVolumeUSD, price, riskMultiplier = 0.5) {
  const maxPositionSizeUSD = avg1mVolumeUSD * riskMultiplier;
  let maxLeverage = Math.floor(maxPositionSizeUSD / depositUSD);
  const limit = EXCHANGE_LIMIT[symbol] || EXCHANGE_LIMIT.default;
  if (maxLeverage > limit) maxLeverage = limit;
  if (maxLeverage < 1) maxLeverage = 1;
  const volumeRatio = avg1mVolumeUSD ? maxPositionSizeUSD / avg1mVolumeUSD : 0;
  return { maxLeverage, maxPositionSizeUSD, volumeRatio };
}

module.exports = { estimateSafeLeverage };
