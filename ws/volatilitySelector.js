// standalone_volatility_debug.js — Проверка структуры и наполнения кэша по символам (вручную)

const { cache } = require('./logic/multiCandleCache');
const config = require('./config/config');
const logger = require('./utils/logger');

function debugCache() {
  const tf = config.TIMEFRAMES.LEVEL_1;
  const requiredCandles = config.VOLATILITY_LOOKBACK / 5;

  logger.basic(`[debug] 📊 Начинаем проверку кэша по таймфрейму ${tf}`);
  const symbols = Object.keys(cache);
  logger.basic(`[debug] 📦 Символов в кэше: ${symbols.length}`);

  for (const symbol of symbols) {
    const candles = cache[symbol]?.[tf];
    const count = candles?.length || 0;

    logger.basic(`[debug] ➜ ${symbol} [${tf}] — ${count} свечей`);
    if (count) {
      logger.verbose(`[debug] 🕯 Пример: ${JSON.stringify(candles[0])}`);
    }
  }

  logger.basic(`[debug] ✅ Проверка завершена`);
}

debugCache();
