function removeSymbolsFromCache(cache, symbols) {
  if (!Array.isArray(symbols)) symbols = [symbols];
  const removed = [];
  symbols.forEach(sym => {
    if (cache[sym]) {
      delete cache[sym];
      removed.push(sym);
    }
  });
  return removed;
}

module.exports = { removeSymbolsFromCache };
