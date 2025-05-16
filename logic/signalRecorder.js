// logic/signalRecorder.js
const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const axios = require('axios');
const historyPath = path.resolve(__dirname, '../logs/signalsHistory.json');

function recordSignal(signalData) {
  const timestamp = new Date().toISOString();
  const entry = { timestamp, ...signalData };

  if (config.ENABLE_HISTORY_LOG) {
    let logData = [];
    if (fs.existsSync(historyPath)) {
      const raw = fs.readFileSync(historyPath);
      logData = JSON.parse(raw);
    }
    logData.push(entry);
    fs.writeFileSync(historyPath, JSON.stringify(logData, null, 2));
  }

  if (config.ENABLE_WEBHOOK && config.WEBHOOK_URL) {
    axios.post(config.WEBHOOK_URL, entry).catch(() => {});
  }
}

module.exports = {
  recordSignal
};
