const config = require('../config/config');
const logger = require('../utils/logger');
const { cache } = require('../logic/multiCandleCache');
const { calculateVolatility } = require('../logic/indicators');

function updateVolatilityRanking() {
  const results = [];
  const requiredLength = config.VOLATILITY_LOOKBACK / 5;

  const allSymbols = Object.keys(cache);

  allSymbols.forEach(symbol => {
    const candles = cache[symbol]?.[config.TIMEFRAMES.LEVEL_1] || [];

    logger.logInfo(`[volatility] ${symbol} [${config.TIMEFRAMES.LEVEL_1}] => ${candles.length} свечей в кэше`);

    if (candles.length < requiredLength) {
      return;
    }

    const vol = calculateVolatility(candles.slice(-requiredLength));
    results.push({ symbol, volatility: vol });
  });

  if (results.length < config.VOLATILITY_TOP_N) {
    logger.logError('[volatility] ❌ Недостаточно данных. Перезапуск в следующем цикле...');
    return;
  }

  results.sort((a, b) => b.volatility - a.volatility);

  const top = results.slice(0, config.VOLATILITY_TOP_N);
  logger.logInfo(`[volatility] 🔝 Топ-${config.VOLATILITY_TOP_N} по волатильности: ${top.map(t => t.symbol).join(', ')}`);
}

setInterval(updateVolatilityRanking, config.VOLATILITY_REFRESH_INTERVAL_SEC * 1000);
