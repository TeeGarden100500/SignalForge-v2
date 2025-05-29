const fs = require('fs');
const path = require('path');

function loadCacheFromFile(filename = 'candles_cache.json') {
  const filePath = path.join(__dirname, filename);
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath);
      const cache = JSON.parse(raw);
      console.log(`[CACHE] ✅ Кэш свечей загружен из ${filePath}`);
      return cache;
    }
  } catch (err) {
    console.error(`[CACHE] ❌ Ошибка при загрузке кэша:`, err);
  }
  return {}; // Возврат пустого кэша, если файл не найден или ошибка
}

module.exports = { loadCacheFromFile };
