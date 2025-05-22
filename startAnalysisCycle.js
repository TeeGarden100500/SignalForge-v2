const { analyzeSymbol } = require('./analyzeSymbol');
const config = require('../config');

function analyzeAllSymbols(symbols, interval) {
  const delayMs = config.SYMBOL_ANALYSIS_DELAY_MS || 500; // шаг между монетами

  symbols.forEach((symbol, i) => {
    setTimeout(() => {
      analyzeSymbol(symbol, interval); // запуск на монету + интервал
    }, i * delayMs);
  });
}

module.exports = { analyzeAllSymbols };
