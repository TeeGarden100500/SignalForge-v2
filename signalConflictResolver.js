function resolveSignalConflicts(signals = []) {
  const { DEBUG_LOG_LEVEL } = require('./config');

  const normalizeDir = dir => (dir || 'NEUTRAL').toUpperCase();

  const groups = {};
  signals.forEach((sig, i) => {
    if (!sig) return;
    const tf = sig.timeframe || sig.tf || sig.interval;
    const key = `${sig.symbol}_${tf}`;
    const direction = normalizeDir(sig.direction);
    const weight = typeof sig.weight === 'number' ? sig.weight : 1;
    if (!groups[key]) groups[key] = [];
    groups[key].push({ ...sig, direction, weight, _idx: i });
  });

  const resolved = [];
  for (const key in groups) {
    const list = groups[key];
    const dirs = [...new Set(list.map(s => s.direction).filter(d => d !== 'NEUTRAL'))];
    if (dirs.length > 1) {
      list.sort((a, b) => (b.weight - a.weight) || (b._idx - a._idx));
      const winner = list[0];
      if (DEBUG_LOG_LEVEL !== 'none') {
        const losers = list.slice(1).map(s => `${s.strategy || s.name} (${s.direction})`).join(', ');
        const tf = winner.timeframe || winner.tf || winner.interval;
        console.warn(`⚠️ Конфликт сигналов на ${winner.symbol} (${tf}): выбрана стратегия ${winner.strategy || winner.name} (${winner.direction}), отклонена ${losers}`);
      }
      resolved.push(strip(winner));
    } else {
      list.forEach(s => resolved.push(strip(s)));
    }
  }

  return resolved;

  function strip(s) {
    const { _idx, ...rest } = s;
    return rest;
  }
}

module.exports = { resolveSignalConflicts };
