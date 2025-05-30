function pruneObsoleteSymbols(candleCache, currentSymbols) {
  const allSymbols = Object.keys(candleCache);
  const toRemove = allSymbols.filter(sym => !currentSymbols.includes(sym));
  
  toRemove.forEach(sym => {
    delete candleCache[sym];
  });

  console.log(`🧹 Очистка кэша: удалено ${toRemove.length} неактуальных символов`);
}

module.exports = { pruneObsoleteSymbols };
