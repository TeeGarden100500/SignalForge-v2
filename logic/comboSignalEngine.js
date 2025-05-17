// 🧠 comboSignalEngine.js — проверка стратегий, логика вывода и рекомендации

const comboStrategies = require('../strategies/comboStrategies');
const config = require('../config/config');
const logger = require('../utils/logger');
const scoring = require('./signalScoring');
const recorder = require('./signalRecorder');
const recommender = require('../core/aiCrossRecommender');
const { getIndicators } = require('../core/indicatorStore');

const signalStrengthRank = {
  'weak': 0,
  'moderate': 1,
  'strong': 2
};

function evaluateComboStrategies(symbol, tf, context) {
  let { conditions, price } = context;

  // Если conditions не заданы — собираем по данным из хранилища
  if (!conditions || !Array.isArray(conditions) || conditions.length === 0) {
    const ind = getIndicators(symbol, tf);
    conditions = [];

    if (ind?.rsi !== undefined) {
      if (ind.rsi < config.RSI_LOW) conditions.push('RSI_LOW');
      if (ind.rsi > config.RSI_HIGH) conditions.push('RSI_HIGH');
    }

    if (ind?.emaFast !== undefined && ind?.emaSlow !== undefined) {
      if (ind.emaFast > ind.emaSlow) conditions.push('EMA_CROSS_UP');
      if (ind.emaFast < ind.emaSlow) conditions.push('EMA_CROSS_DOWN');
    }

    if (ind?.macd?.histogram > 0) conditions.push('MACD_HIST_POSITIVE');
    if (ind?.macd?.histogram < 0) conditions.push('MACD_HIST_NEGATIVE');
  }

  comboStrategies.forEach(strategy => {
    const matched = strategy.conditions.filter(c => conditions.includes(c));
    const matchRatio = matched.length / strategy.conditions.length;

    if (matchRatio >= 0.9) {
      const strength = scoring.getSignalStrength(matchRatio);

      const minStrength = config.MIN_SIGNAL_STRENGTH || 'weak';
      if (signalStrengthRank[strength] < signalStrengthRank[minStrength]) {
        logger.verbose(`[${symbol} | ${tf}] Сигнал '${strategy.name}' отфильтрован (сила: ${strength} < ${minStrength})`);
        return;
      }

      const logMsg = [
        `\n[comboLog] ${strategy.message}`,
        `↪ ${strategy.explanation}`,
        `↪ Символ: ${symbol} | TF: ${tf} | Цена: ${price} | Сила: ${strength}`
      ].join('\n');

      logger.basic(logMsg);

      recommender.suggestCrossStrategy({
        name: strategy.name,
        symbol,
        conditions,
        direction: strategy.direction,
        price
      });

      recorder.recordSignal({
        name: strategy.name,
        message: strategy.message,
        explanation: strategy.explanation,
        symbol,
        timeframe: tf,
        price,
        strength,
        timestamp: new Date().toISOString()
      });
    }
  });
}

module.exports = { evaluateComboStrategies };
