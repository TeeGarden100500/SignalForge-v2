// 🧠 aiCrossRecommender.js — логика рекомендаций по кросс-курсам на основе ловушек

const logger = require('../utils/logger');

function suggestCrossStrategy({ name, symbol, conditions, direction, price }) {
  const suggestions = [];

  if (name === 'False Breakout Trap' && symbol === 'BTCUSDT') {
    suggestions.push({
      pair: 'ETHBTC',
      action: 'long',
      note: 'Биткойн не смог закрепиться выше — возможно, альты наберут силу против BTC.'
    });
    suggestions.push({
      pair: 'LTCBTC',
      action: 'long',
      note: 'Слабость BTC может дать шанс входа в сильные альты.'
    });
  }

  if (name === 'False Breakdown Trap' && symbol === 'BTCUSDT') {
    suggestions.push({
      pair: 'SOLBTC',
      action: 'short',
      note: 'BTC не пробил вниз, но альты могут перегрето падать — ищи шорт по тренду.'
    });
    suggestions.push({
      pair: 'ADABTC',
      action: 'short',
      note: 'Паника в альтах может быть чрезмерной — смотри откат к BTC.'
    });
  }

  if (suggestions.length > 0) {
    logger.basic(`\n[recommender] ${symbol}: ${name}`);
    suggestions.forEach(({ pair, action, note }) => {
      logger.basic(`↪ Рекомендация: ${pair.toUpperCase()} | Действие: ${action.toUpperCase()} → ${note}`);
    });
  }
}

module.exports = { suggestCrossStrategy };
