const axios = require('axios');
const { basicLog } = require('./logger');

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


async function fetchLatestFundingRate(symbol) {
  try {
    const url = `https://fapi.binance.com/fapi/v1/fundingRate?symbol=${symbol}&limit=1`;
    const response = await axios.get(url);
    const data = Array.isArray(response.data) ? response.data[0] : null;
    return data ? parseFloat(data.fundingRate) : null;
  } catch (_) {
    return null;
  }
}

async function getFundingRates(symbols = []) {
  const rates = [];
  for (const sym of symbols) {
    const rate = await fetchLatestFundingRate(sym);
    if (typeof rate === 'number') {
      rates.push({ symbol: sym, rate });
    }
  }
  return rates;
}

function logTopFundingRates(rates = []) {
  if (!Array.isArray(rates) || rates.length === 0) return;
  const lines = ['🏆 ТОП Funding Rate (LONG):'];
  rates.forEach((r, i) => {
    const pct = (r.rate * 100).toFixed(3);
    lines.push(`#${i + 1} ${r.symbol} → +${pct}%`);
  });
  basicLog(lines.join('\n'));
}

async function showTopFundingRates(symbols = []) {
  const data = await getFundingRates(symbols);
  const positive = data.filter(d => d.rate > 0);
  positive.sort((a, b) => b.rate - a.rate);
  const top20 = positive.slice(0, 20);
  logTopFundingRates(top20);
}

module.exports = { fetchFundingRate, showTopFundingRates };

