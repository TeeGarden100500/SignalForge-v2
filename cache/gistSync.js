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
    const parsed = JSON.parse(content);
    console.log(`[GIST] ✅ Кэш загружен из Gist (${GIST_FILENAME})`);
    return parsed;
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
    console.log(`[GIST] ✅ Кэш свечей сохранён в Gist (${GIST_FILENAME})`);
  } catch (err) {
    console.error(`[GIST] ❌ Ошибка при сохранении в Gist:`, err.message);
  }
}

module.exports = { loadFromGist, saveToGist };
