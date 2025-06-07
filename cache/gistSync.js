// 📁 cache/gistSync.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const {
  GITHUB_CACHE_ENABLED,
  GITHUB_TOKEN,
  GIST_ID,
  GIST_FILENAME
} = require('../config');

const headers = {
  'Authorization': `token ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json'
};

const GIST_URL = `https://api.github.com/gists/${GIST_ID}`;

async function loadFromGist() {
  if (!GITHUB_CACHE_ENABLED) return {};

  try {
    const response = await axios.get(GIST_URL, { headers });
    const content = response.data.files[GIST_FILENAME].content;

    try {
      const cache = JSON.parse(content);
      console.log(`[GIST] ✅ Кэш загружен из Gist (${GIST_FILENAME})`);
      return cache;
    } catch (e) {
      console.error('[GIST] ❌ Ошибка чтения JSON. Очистка...');
      return {};
    }

  } catch (err) {
    console.error(`[GIST] ❌ Ошибка при загрузке из Gist:`, err.message);
    return {};
  }
}

async function saveToGist(cache) {
  if (!GITHUB_CACHE_ENABLED) return;
  try {
    const payload = {
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify(cache, null, 2)
        }
      }
    };
   await axios.patch(GIST_URL, payload, { headers });
const jsonStr = JSON.stringify(cache);
const sizeKb = Buffer.byteLength(jsonStr) / 1024;

if (sizeKb > 1500) {
  console.warn(`[GIST] ⚠️ Размер JSON (${sizeKb.toFixed(1)} KB) превышает лимит 1500 KB. Сохранение отменено.`);
  return;
}
let totalCandles = 0;
let totalSymbols = 0;
let totalTimeframes = 0;

for (const [symbol, tfObj] of Object.entries(cache)) {
  totalSymbols++;
  for (const [tf, candles] of Object.entries(tfObj)) {
    totalTimeframes++;
    totalCandles += candles.length;
  }
}

console.log(`[GIST] ✅ Кэш сохранён в Gist (${GIST_FILENAME})`);
console.log(`📊 Символов: ${totalSymbols} | Таймфреймов: ${totalTimeframes} | Свечей: ${totalCandles}`);
console.log(`💾 Объём JSON: ${sizeKb.toFixed(1)} KB`);

  } catch (err) {
    console.error(`[GIST] ❌ Ошибка при сохранении в Gist:`, err.message);
  }
}

module.exports = { loadFromGist, saveToGist };
