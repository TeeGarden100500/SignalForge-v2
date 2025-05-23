module.exports = {
  TOP_N_PAIRS: 10,
  PAIR_SUFFIX: 'USDT',
  SYMBOL_ANALYSIS_DELAY_MS: 500, // 0.5 сек между монетами (на 50 монет ≈ 25 сек)
  DEBUG_LOG_LEVEL: 'verbose', // 'none' | 'basic' | 'verbose'
  VOLATILITY_UPDATE_INTERVAL_HOURS: 6, // обновление каждые 6 часов после тестов поставить цифру 6
  EMA_ANGLE_THRESHOLD: 0.05, //🔧 Порог угла наклона EMA (в радианах), выше которого считаем тренд направленным. 
                             //    Пример: 0.05 ~ 2.86°, что является умеренным наклоном
  
  DOJI_BODY_RATIO: 0.3, // 🔧 Условие для Doji: тело составляет менее 30% от полного диапазона свечи
  MEAN_REVERS_THRESHOLD_DOWN: -2.0, // Цена ниже MA на X%
  MEAN_REVERS_THRESHOLD_UP: 3.0, // Цена выше MA на X%
  BREAKOUT_LOOKBACK: 2, // Breakout: сравниваем текущую цену с High/Low, отстоящими на N свечей назад

  CACHE_LIMITS: {
  '5m': 120,
  '15m': 100,
  '1h': 72
}
  
};
