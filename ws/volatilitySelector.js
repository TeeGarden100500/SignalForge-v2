const config = require('..config/config.js');
const logger = require('../core/logger');
const cache = require('../logic/multiCandleCache');

let notified = false;

function updateVolatilityRanking() {
  const symbols = Object.keys(cache);
  const volatilities = [];

  for (const symbol of symbols) {
    const interval = '5m';
    const candles = cache[symbol]?.[interval];

    if (!candles || candles.length < config.VOLATILITY_LOOKBACK / 5) {
      if (!notified) {
        logger.error('[volatility] ❌ Недостаточно данных. Перезапуск в следующем цикле...');
        notified = true;
      }
      return;
    }

    const closes = candles.slice(-config.VOLATILITY_LOOKBACK / 5).map(c => c.close);
    const max = Math.max(...closes);
    const min = Math.min(...closes);
    const vol = ((max - min) / min) * 100;
    volatilities.push({ symbol, vol });
  }

  volatilities.sort((a, b) => b.vol - a.vol);
  const top = volatilities.slice(0, config.VOLATILITY_TOP_N);
  logger.info(`[volatility] 💥 Top-${top.length} монет: ${top.map(v => v.symbol).join(', ')}`);
}

module.exports = { updateVolatilityRanking };
