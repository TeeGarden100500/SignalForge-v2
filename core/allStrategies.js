module.exports = {
  checkRSIStrategy: require('./strategyRSI').checkRSIStrategy,
  checkMACDStrategy: require('./strategyMACD').checkMACDStrategy,
  checkVolumeSpikeStrategy: require('./strategyVolumeSpike').checkVolumeSpikeStrategy,
  checkEMACrossStrategy: require('./strategyEMA').checkEMACrossStrategy,
  checkEMAAngleStrategy: require('./strategyEMA').checkEMAAngleStrategy,
  checkBreakoutStrategy: require('./strategyBreakout').checkBreakoutStrategy,
  checkHighLowProximity: require('./strategyHighLow').checkHighLowProximity,
  checkMeanReversionStrategy: require('./strategyMeanReversion').checkMeanReversionStrategy,
  checkATRSpikeStrategy: require('./strategyATR').checkATRSpikeStrategy,
  checkADXStrengthStrategy: require('./strategyADX').checkADXStrengthStrategy,
  checkFiboProximityStrategy: require('./strategyFibo').checkFiboProximityStrategy,
  checkDojiPattern: require('./strategyDoji').checkDojiPattern,
  checkRSIHiddenBull: require('./strategyRSIHiddenBull').checkRSIHiddenBull,
  checkRSIVolumeFade: require('./strategyRSI_Volume_Fade'),
  checkMACDDivergence: require('./strategyMACDDivergence').checkMACDDivergence,
  checkGreenCandle: require('./strategyCandlePatterns').checkGreenCandle,
  checkFlashCrashRecovery: require('../strategies/strategyFlashCrashRecovery').checkFlashCrashRecovery,
  checkStopLossHunt: require('../strategies/strategyStopLossHunt').checkStopLossHunt,
  checkVolumeTrap: require('../strategies/strategyVolumeTrap').checkVolumeTrap,
  checkWickRejection: require('../strategies/strategyWickRejection').checkWickRejection,
  checkLiquidityRebound: require('../strategies/strategyLiquidityRebound').checkLiquidityRebound,
  checkMarketCompression: require('../strategies/strategyMarketCompression').checkMarketCompression,
};
