module.exports = {
  TOP_N_PAIRS: 5,
  PAIR_SUFFIX: 'USDT',
  DEBUG_LOG_LEVEL: 'verbose', // 'none' | 'basic' | 'verbose'
  VOLATILITY_UPDATE_INTERVAL_HOURS: 0.0833, // обновление каждые 6 часов после тестов поставить цифру 6
  CACHE_LIMITS: {
  '5m': 120,
  '15m': 100,
  '1h': 72
}
  
};
