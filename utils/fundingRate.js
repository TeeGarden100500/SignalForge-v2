const cache = {};

async function fetchFundingRate(symbol) {
  const cached = cache[symbol];
  const now = Date.now();
  if (cached && now - cached.ts < 60_000) {
    return cached.data;
  }
  try {
    const url = `https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${symbol}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const rate = parseFloat(data.lastFundingRate);
    const intervalHours = data.nextFundingTime && data.time
      ? Math.round((data.nextFundingTime - data.time) / 36e5) || 8
      : 8;
    const info = { rate, intervalHours };
    cache[symbol] = { ts: now, data: info };
    return info;
  } catch (err) {
    return null;
  }
}

module.exports = { fetchFundingRate };
