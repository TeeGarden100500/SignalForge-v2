function waitForCandles(candlesReceived, symbols, interval = '5m', timeoutMs = 60000) {
  return new Promise(resolve => {
    const start = Date.now();
    const timer = setInterval(() => {
      const ready = symbols.filter(sym => candlesReceived[sym]?.[interval]);
      const allReady = ready.length >= symbols.length;
      if (allReady || Date.now() - start >= timeoutMs) {
        clearInterval(timer);
        if (!allReady) {
          console.warn('⚠ [WARN] Некоторые пары не получают свечи. Отбор будет выполнен по доступным.');
        }
        console.log(`✅ Получено свечей: ${ready.length} из ${symbols.length} пар`);
        resolve(ready);
      }
    }, 1000);
  });
}

module.exports = { waitForCandles };
