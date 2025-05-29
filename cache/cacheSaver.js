const fs = require('fs');
const path = require('path');

function saveCacheToFile(cache, filename = 'candles_cache.json') {
  const filePath = path.join(__dirname, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(cache, null, 2));
//    console.log(`[CACHE] ✅ Кэш свечей сохранён в ${filePath}`);
  } catch (err) {
    console.error(`[CACHE] ❌ Ошибка при сохранении кэша:`, err);
  }
}

module.exports = { saveCacheToFile };
