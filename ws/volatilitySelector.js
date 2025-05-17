
const config = require('../config/config');
const { logInfo, logVerbose, logError } = require('../utils/logger');
const multiCandleCache = require('../logic/multiCandleCache');

function startVolatilityLoop() {
    try {
        const allSymbols = Object.keys(multiCandleCache.cache);
        const volatilityScores = [];

        for (const symbol of allSymbols) {
            const candles = multiCandleCache.cache[symbol]?.['5m'] || [];

            logVerbose(`[volatility] ${symbol} — накоплено свечей: ${candles.length}`);

            if (candles.length < config.VOLATILITY_LOOKBACK / 5) {
                logInfo(`[volatility] ⚠️ Недостаточно свечей по ${symbol}, требуется: ${config.VOLATILITY_LOOKBACK / 5}, сейчас: ${candles.length}`);
                continue;
            }

            const closes = candles.slice(-config.VOLATILITY_LOOKBACK / 5).map(c => c.close);
            const max = Math.max(...closes);
            const min = Math.min(...closes);
            const volatility = ((max - min) / min) * 100;

            volatilityScores.push({ symbol, volatility });
        }

        volatilityScores.sort((a, b) => b.volatility - a.volatility);
        const topSymbols = volatilityScores.slice(0, config.VOLATILITY_TOP_N);

        logInfo(`[volatility] Топ-${config.VOLATILITY_TOP_N} монет: ${topSymbols.map(s => s.symbol).join(', ')}`);
        return topSymbols.map(s => s.symbol);

    } catch (error) {
        logError(`[volatility] ❌ Ошибка при получении волатильных монет: ${error.message}`);
        return [];
    }
}

module.exports = { startVolatilityLoop };
