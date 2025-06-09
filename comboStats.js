const fs = require('fs');
const path = require('path');
const { comboStrategies } = require('./comboStrategies');

const logFile = path.join(__dirname, 'logs/combo_debug.log');
if (!fs.existsSync(logFile)) {
  console.log('Лог файл не найден');
  process.exit(0);
}

const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
const data = fs.readFileSync(logFile, 'utf8').trim().split('\n');

const firedMap = {};
for (const line of data) {
  const m = line.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z) - .*?COMBO \"(.+?)\" .*?/);
  if (!m) continue;
  const [ , ts, name ] = m;
  const time = Date.parse(ts);
  if (time >= sevenDaysAgo && line.includes('✅ COMBO')) {
    firedMap[name] = (firedMap[name] || 0) + 1;
  }
}

if (Object.keys(firedMap).length === 0) {
  console.log('За последние 7 дней ни одна COMBO не сработала.');
} else {
  console.log('📈 COMBO статистика за последние 7 дней:');
  Object.entries(firedMap).forEach(([name, count]) => {
    console.log(`${name}: ${count}`);
  });
}

const allNames = comboStrategies.map(c => c.name);
const inactive = allNames.filter(n => !firedMap[n]);
if (inactive.length > 0) {
  console.log('\nНе активировались:');
  inactive.forEach(n => console.log(`- ${n}`));
}
