module.exports = [
  {
    "name": "Momentum Rebound",
    "conditions": [
      "RSI_LOW",
      "EMA_ANGLE_UP",
      "VOLUME_SPIKE"
    ],
    "direction": "long",
    "message": "🟢 [Momentum Rebound] Возможен быстрый отскок. Вход по рынку.",
    "explanation": "Цена перепродана (RSI), EMA направлена вверх, а объём усиливается — возможно началось движение."
  },
  {
    "name": "Volume Breakout",
    "conditions": [
      "TOUCH_RESISTANCE",
      "VOLUME_SPIKE",
      "STRONG_TREND"
    ],
    "direction": "long",
    "message": "🟢 [Volume Breakout] Возможен пробой уровня с ростом. Следи за импульсом.",
    "explanation": "Цена у сопротивления, объём всплеск, тренд сильный — возможен прорыв вверх."
  },
  {
    "name": "Exhaustion Top",
    "conditions": [
      "RSI_HIGH",
      "VOLUME_SPIKE",
      "MACD_HIST_NEGATIVE"
    ],
    "direction": "short",
    "message": "🔴 [Exhaustion Top] Перекупленность и ослабление. Возможен разворот.",
    "explanation": "Цена перекуплена, объём высокий, MACD слабеет — признак разворота вниз."
  },
  {
    "name": "Bullish Divergence",
    "conditions": [
      "RSI_LOW",
      "MACD_HIST_POSITIVE",
      "EMA_CROSS_UP"
    ],
    "direction": "long",
    "message": "🟢 [Bullish Divergence] Бычья дивергенция. Рассматривай вход.",
    "explanation": "Индикаторы улучшаются при слабой цене — сигнал скрытого роста."
  },
  {
    "name": "FIBO Rebound",
    "conditions": [
      "TOUCH_FIBO",
      "RSI_HIGH",
      "VOLUME_SPIKE"
    ],
    "direction": "long",
    "message": "🟢 [FIBO Rebound] Цена у уровня Фибоначчи. Возможен отскок.",
    "explanation": "Цена касается ключевого уровня FIBO, объём высокий, RSI уверенный — возможен отскок вверх."
  },
  {
    "name": "Dead Volume Fall",
    "conditions": [
      "RSI_LOW",
      "VOLUME_SPIKE",
      "EMA_CROSS_DOWN"
    ],
    "direction": "short",
    "message": "🔴 [Dead Volume Fall] Сигнал на падение. Слабый рынок + объём.",
    "explanation": "Слабость в RSI, объём не поддерживает — цена может упасть."
  },
  {
    "name": "Trend Acceleration",
    "conditions": [
      "EMA_CROSS_UP",
      "STRONG_TREND",
      "EMA_ANGLE_UP"
    ],
    "direction": "long",
    "message": "🟢 [Trend Acceleration] Усиление восходящего тренда. Подтверждение импульса.",
    "explanation": "EMA пересеклась вверх, тренд подтверждён ADX, угол EMA положительный — всё указывает на ускорение."
  },
  {
    "name": "Double Confirmation",
    "conditions": [
      "RSI_LOW",
      "EMA_CROSS_UP",
      "MACD_HIST_POSITIVE"
    ],
    "direction": "long",
    "message": "🟢 [Double Confirmation] Подтверждённый вход. Индикаторы согласованы.",
    "explanation": "Все три сигнала подтверждают рост: RSI, EMA и MACD."
  },
  {
    "name": "Resistance Break",
    "conditions": [
      "BREAKOUT_RESISTANCE",
      "VOLUME_SPIKE",
      "STRONG_TREND"
    ],
    "direction": "long",
    "message": "🟢 [Resistance Break] Цена пробила сопротивление. Вход на импульсе.",
    "explanation": "Произошёл пробой уровня сопротивления с ростом объёма и подтверждённым трендом."
  },
  {
    "name": "Support Breakdown",
    "conditions": [
      "BREAKDOWN_SUPPORT",
      "VOLUME_SPIKE",
      "HIGH_VOLATILITY"
    ],
    "direction": "short",
    "message": "🔴 [Support Breakdown] Цена пробила поддержку. Возможен обвал.",
    "explanation": "Цена пробила ключевой уровень поддержки на высоком объёме и в условиях волатильности. Возможна распродажа."
  }
]
