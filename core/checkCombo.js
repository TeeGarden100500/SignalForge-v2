const fs = require('fs');
const path = require('path');
const { comboStrategies } = require('../comboStrategies');
const {
  DEBUG_LOG_LEVEL,
  DEFAULT_DEPOSIT_USD,
  DEBUG_COMBO_SKIP_REASON,
  LOG_SKIPPED_COMBO
} = require('../config');
const { estimateSafeLeverage } = require('../utils/riskAnalyzer');
const { fetchFundingRate } = require('../utils/fundingRate');

const logFilePath = path.join(__dirname, '../logs/combo_debug.log');

// Убедимся, что папка logs существует
if (!fs.existsSync(path.dirname(logFilePath))) {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

function logToFile(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFilePath, `${timestamp} - ${message}\n`);
}

function calcAvg1mVolumeUSD(candles, timeframe, lookbackMinutes = 10) {
  if (!Array.isArray(candles) || candles.length === 0) return 0;
  const tf = timeframe.includes('h')
    ? parseInt(timeframe) * 60
    : parseInt(timeframe);
  const minutes = isNaN(tf) || tf <= 0 ? 1 : tf;
  const candleCount = Math.min(candles.length, Math.ceil(lookbackMinutes / minutes));
  const recent = candles.slice(-candleCount);
  const totalVolumeUSD = recent.reduce((sum, c) => sum + c.volume * c.close, 0);
  const totalMinutes = candleCount * minutes;
  return totalMinutes ? totalVolumeUSD / totalMinutes : 0;
}

async function checkComboStrategies(symbol, signals, timeframe, candles = [], indicators = {}) {
  const fired = [];
  let firedCount = 0;

  for (const combo of comboStrategies) {
    const matches = combo.conditions.filter(cond => signals.includes(cond));
    const minMatch = combo.minMatch || combo.conditions.length;

    if (DEBUG_LOG_LEVEL === 'verbose') {
      const logLine = `[DEBUG] COMBO: проверка стратегии ${combo.name} — совпало ${matches.length} из ${combo.conditions.length} тегов`;
      console.log(logLine);
      logToFile(logLine);
    }

    if (matches.length >= minMatch) {
      if (typeof combo.validator === 'function') {
        const valid = combo.validator({ symbol, timeframe, candles, indicators, signals });
        if (!valid) continue;
      }
      firedCount++;

      const baseMsg = typeof combo.message === 'function'
        ? combo.message(symbol, timeframe)
        : combo.message;

      const price = candles.at(-1)?.close || 0;
      const avg1mVolumeUSD = calcAvg1mVolumeUSD(candles, timeframe);
      const { maxLeverage, maxPositionSizeUSD } = estimateSafeLeverage(
        symbol,
        DEFAULT_DEPOSIT_USD,
        avg1mVolumeUSD,
        price
      );
      const safeLine = `\u{1F4BC} Safe Leverage: до ${maxLeverage}x (порог \u2248 $${maxPositionSizeUSD.toFixed(0)} при депозите $${DEFAULT_DEPOSIT_USD}, объём монеты: $${avg1mVolumeUSD.toFixed(2)}/мин)`;
      const frInfo = await fetchFundingRate(symbol);
      const frLine = frInfo && typeof frInfo.rate === 'number'
        ? `\u{1F4B8} Funding Rate (${frInfo.intervalHours}h): ${(frInfo.rate * 100).toFixed(4)}%`
        : '\u{1F4B8} Funding Rate: недоступен';
      const msg = `${baseMsg}\n${safeLine}\n${frLine}`;

      const logLine = `[COMBO] ✅ COMBO-стратегия [${combo.name}] для ${symbol} сработала: ${baseMsg}`;
      console.log(logLine);
      logToFile(logLine);
      logToFile(safeLine);
      logToFile(frLine);

      fired.push({
        symbol,
        timeframe,
        name: combo.name,
        message: msg,
        fundingRate: frInfo ? frInfo.rate : null,
        direction: (combo.direction || 'NEUTRAL').toUpperCase(),
        weight: combo.weight || 1
      });
    } else {
      const missing = combo.conditions.filter(cond => !signals.includes(cond));

      if (LOG_SKIPPED_COMBO && DEBUG_COMBO_SKIP_REASON && DEBUG_LOG_LEVEL === 'verbose') {
        const info = `[INFO] \u23ED\uFE0F COMBO-стратегия [${combo.name}] пропущена: отсутствуют теги: ${missing.join(', ')}`;
        console.log(info);
        logToFile(info);
      }

      if (DEBUG_LOG_LEVEL === 'verbose') {
        const msg = `❌ COMBO "${combo.name}" НЕ сработала для ${symbol}: не хватает тегов: ${missing.join(', ')} (${matches.length}/${minMatch})`;
        console.log(msg);
        logToFile(msg);
      }
    }
  }

  if (DEBUG_LOG_LEVEL === 'verbose') {
    const summary = `📊 Проверено COMBO стратегий: ${comboStrategies.length} | Сработало: ${firedCount}`;
    console.log(summary);
    logToFile(summary);
    logToFile('');
  }

  return fired;
}

module.exports = {
  checkComboStrategies
};
