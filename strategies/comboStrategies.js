// strategies/comboStrategies.js
module.exports = [
  {
    name: 'Momentum Rebound',
    conditions: ['RSI_LOW', 'EMA_ANGLE_UP', 'VOLUME_SPIKE'],
    direction: 'long',
    message: '🟢 [Momentum Rebound] Возможен быстрый отскок. Вход по рынку.'
  },
  {
    name: 'Volume Breakout',
    conditions: ['BREAKOUT_HIGH', 'VOLUME_SPIKE', 'ADX_STRONG'],
    direction: 'long',
    message: '🟢 [Volume Breakout] Пробой уровня с подтверждением объёма и тренда.'
  },
  {
    name: 'Exhaustion Top',
    conditions: ['RSI_HIGH', 'VOLUME_SPIKE', 'DOJI_CANDLE'],
    direction: 'short',
    message: '🔴 [Exhaustion Top] Возможен откат после перегретого роста.'
  },
  {
    name: 'Bullish Divergence',
    conditions: ['RSI_DIVERGENCE_BULL'],
    direction: 'long',
    message: '🟢 [Bullish Divergence] Быча дивергенция на RSI. Возможен разворот.'
  },
  {
    name: 'Bearish Crossover Trap',
    conditions: ['MACD_CROSS_DOWN', 'RSI_MID', 'LOW_VOLUME'],
    direction: 'short',
    message: '🔴 [Bearish Crossover Trap] Ложный сигнал на снижение. Будь осторожен.'
  },
  {
    name: 'Mean Reversion Setup',
    conditions: ['PRICE_ABOVE_MA', 'LOW_VOLUME'],
    direction: 'short',
    message: '🔴 [Mean Reversion] Цена далеко от MA при низком объёме. Возможен откат.'
  },
  {
    name: 'Trend Acceleration',
    conditions: ['EMA_CROSS', 'ADX_STRONG', 'GREEN_CANDLE'],
    direction: 'long',
    message: '🟢 [Trend Acceleration] Усиление тренда. Возможен импульс.'
  },
  {
    name: 'Dead Volume Fall',
    conditions: ['PRICE_FALL', 'VOLUME_FADE', 'RSI_NEUTRAL'],
    direction: 'short',
    message: '🔴 [Dead Volume] Объёмы затухают при падении. Осторожно.'
  },
  {
    name: 'Double Confirmation',
    conditions: ['RSI_LOW', 'EMA_CROSS_UP', 'MACD_HIST_FLIP'],
    direction: 'long',
    message: '🟢 [Double Confirmation] Подтверждённый вход. RSI + EMA + MACD.'
  },
  {
    name: 'FIBO Rebound',
    conditions: ['TOUCH_FIBO', 'RSI_ABOVE_40', 'VOLUME_SPIKE'],
    direction: 'long',
    message: '🟢 [FIBO Rebound] Отскок от уровня Fibo + объём и RSI.'
  }
];
