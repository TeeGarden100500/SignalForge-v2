// logic/signalScoring.js
function getSignalStrength(matchedConditionsCount, totalConditionsCount) {
  const ratio = matchedConditionsCount / totalConditionsCount;

  if (ratio >= 0.9) return 'strong';
  if (ratio >= 0.6) return 'moderate';
  return 'weak';
}

module.exports = {
  getSignalStrength
};
