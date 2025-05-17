// config/config.js
module.exports = {
  // ░░░ Логирование ░░░
  DEBUG_LOG_LEVEL: 'verbose', // Уровень логирования: none | basic | verbose
  DEBUG_LOGGING: true,        // Включить детальное логирование
  ENABLE_HISTORY_LOG: true,   // Сохранять сигналы в файл истории

  // ░░░ Таймфреймы ░░░
  TIMEFRAMES: {
    LEVEL_1: '5m',    // Младший таймфрейм (например, для сигнала)
    LEVEL_2: '15m',   // Средний таймфрейм (например, для фильтрации)
    LEVEL_3: '1h'     // Старший таймфрейм (например, подтверждение)
  },
  
  INTERVAL: '5m', // Основной рабочий интервал
  MIN_SIGNAL_STRENGTH: 'moderate', // допустимо: 'weak' | 'moderate' | 'strong'
  

  // ░░░ RSI ░░░
  RSI_PERIOD: 60,     // Период RSI
  RSI_LOW: 30,        // Нижняя граница (перепроданность)
  RSI_HIGH: 70,       // Верхняя граница (перекупленность)

  // ░░░ EMA ░░░
  EMA_FAST: 12,       // Быстрая EMA
  EMA_SLOW: 26,       // Медленная EMA

  // ░░░ MACD ░░░
  MACD_FAST: 12,      // Быстрая EMA для MACD
  MACD_SLOW: 26,      // Медленная EMA для MACD
  MACD_SIGNAL: 9,     // Сигнальная EMA для MACD

  // ░░░ EMA угол ░░░
  EMA_ANGLE_PERIOD: 3,        // Период EMA для расчёта угла
  EMA_ANGLE_THRESHOLD: 0.00005, // Минимальный угол наклона для сигнала
  EMA_ANGLE_LENGTH: 5,        // Длина отрезка для вычисления угла

  // ░░░ Mean Reversion ░░░
  MEAN_REVERSION_MA_PERIOD: 30, // Период скользящей средней
  MEAN_REVERSION_THRESHOLD: 0.5, // Порог отклонения от MA в %

  // ░░░ ATR (волатильность) ░░░
  ATR_PERIOD: 14,         // Период ATR
  MIN_ATR_PERCENT: 0.5,   // Минимальная волатильность в %

  // ░░░ ADX (сила тренда) ░░░
  ADX_PERIOD: 14,     // Период ADX
  MIN_ADX: 20,        // Минимальный уровень тренда

  // ░░░ Объём ░░░
  VOLUME_LOOKBACK: 20,              // Сколько свечей учитывать
  VOLUME_SPIKE_MULTIPLIER: 2.5,     // Множитель для спайка объёма

  // ░░░ Пробой ░░░
  BREAKOUT_LOOKBACK: 60,          // Кол-во свечей для сравнения
  BREAKOUT_MARGIN_PERCENT: 0.05,  // Допуск пробоя в %

  // ░░░ Фибоначчи ░░░
  FIBO_TOLERANCE_PERCENT: 5.5,    // Допуск попадания в уровень Fibo

  // ░░░ Порог к high/low ░░░
  PERCENT_TO_HIGH: 10,   // Сколько осталось до High за 12 мес
  PERCENT_TO_LOW: 10,    // Сколько осталось до Low за 12 мес

  // ░░░ Фильтрация сигналов ░░░
  SIGNAL_CONFIRMATION_COUNT: 2,    // Сколько индикаторов должно совпасть
  SIGNAL_TIME_WINDOW_UTC: {        // Временное окно, в котором разрешены сигналы
    start: '00:00',
    end: '23:59'
  },

  // ░░░ Webhook ░░░
  ENABLE_WEBHOOK: true,    // Включить отправку webhook
  WEBHOOK_URL: 'https://webhook.site/b5170fa9-7272-431f-8eeb-66d1e4bc4eec',

  // ░░░ Кэш ░░░
  MAX_CACHE_LENGTH: 500,  // Максимальное количество свечей в кэше

  // ░░░ Волатильность ░░░
  VOLATILITY_TOP_N: 5,     // Сколько монет отбирать по волатильности
  VOLATILITY_TOP_COUNT: 5, // (дублируется для совместимости)
  VOLATILITY_LOOKBACK: 10,  // Сколько минут учитывать при расчете волатильности
  VOLATILITY_REFRESH_INTERVAL_SEC: 60, // Как часто пересчитывать волатильность (в секундах)

  // ░░░ Подписки WebSocket ░░░
  SUBSCRIPTION_REFRESH_INTERVAL_MS: 5 * 60 * 1000, // Обновление подписок каждые 5 мин
  BINANCE_STREAM_URL: 'wss://stream.binance.com:9443/ws', // WebSocket адрес Binance

  // ░░░ Пути к данным ░░░
  MANUAL_LEVELS_PATH: './data/manualLevels.json',      // Путь к ручным уровням
  YEAR_HIGH_LOW_PATH: './data/yearHighLow.json'        // Путь к high/low за год
};
