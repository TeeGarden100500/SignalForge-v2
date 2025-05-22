module.exports = {
  TOP_N_PAIRS: 50,
  PAIR_SUFFIX: 'USDT',
  SYMBOL_ANALYSIS_DELAY_MS: 500, // 0.5 сек между монетами (на 50 монет ≈ 25 сек)
  DEBUG_LOG_LEVEL: 'none', // 'none' | 'basic' | 'verbose'
  VOLATILITY_UPDATE_INTERVAL_HOURS: 6, // обновление каждые 6 часов после тестов поставить цифру 6
  CACHE_LIMITS: {
  '5m': 120,
  '15m': 100,
  '1h': 72
}
  
};
