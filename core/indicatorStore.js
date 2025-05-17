// core/indicatorStore.js

// Временное хранилище для индикаторных значений по каждому символу и таймфрейму
const store = {};

function saveIndicators(symbol, tf, indicators) {
  if (!store[symbol]) store[symbol] = {};
  store[symbol][tf] = indicators;
}

function getIndicators(symbol, tf) {
  return store[symbol]?.[tf] || {};
}

module.exports = {
  saveIndicators,
  getIndicators
};
