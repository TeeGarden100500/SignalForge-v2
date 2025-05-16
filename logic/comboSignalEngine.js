// 🧠 comboSignalEngine.js — проверка стратегий, логика вывода и рекомендации

const comboStrategies = require('../strategies/comboStrategies');
const config = require('../config/config');
const logger = require('../utils/logger');
const scoring = require('../core/signalScoring');
const recorder = require('./signalRecorder');
const recommender = require('../core/aiCrossRecommender');

const signalStrengthRank = {
  'weak': 0,
  'moderate': 1,
  'strong': 2
};

function evaluateComboStrategies(symbol, tf, context) {
  const { conditions, price } = context;

  comboStrategies.forEach(strategy => {
    const matched = strategy.conditions.filter(c => conditions.includes(c));
    const matchRatio = matched.length / strategy.conditions.length;

    if (matchRatio >= 0.9) {
      const strength = scoring.getSignalStrength(matchRatio);

      // 🔎 Фильтрация по config.MIN_SIGNAL_STRENGTH
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

      // 💡 AI рекомендация
      recommender.suggestCrossStrategy({
        name: strategy.name,
        symbol,
        conditions,
        direction: strategy.direction,
        price
      });

      // 📤 Отправка в лог + webhook
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
