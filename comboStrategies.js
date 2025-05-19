const comboStrategies = [
  {
    name: "Momentum Rebound",
    conditions: ["RSI_LOW", "EMA_ANGLE_UP", "VOLUME_SPIKE"],
    direction: "long",
    message: "🟢 [Momentum Rebound] Возможен быстрый отскок. Вход по рынку."
  },
  {
    name: "Volume Breakout",
    conditions: ["BREAKOUT", "VOLUME_SPIKE", "ADX_TREND"],
    direction: "long",
    message: "📈 [Volume Breakout] Пробой с объёмом. Рассматривай вход на импульсе."
  },
  {
    name: "Exhaustion Top",
    conditions: ["RSI_HIGH", "VOLUME_SPIKE", "DOJI"],
    direction: "short",
    message: "🔻 [Exhaustion Top] Перекупленность и выгорание — возможен разворот."
  },
  {
    name: "Bullish Divergence",
    conditions: ["RSI_HIDDEN_BULL", "MACD_DIVERGENCE"],
    direction: "long",
    message: "🟢 [Bullish Divergence] Дивергенция — возможен отскок вверх."
  },
  {
    name: "Mean Reversion Setup",
    conditions: ["MEAN_REVERS_UP", "VOLUME_LOW"],
    direction: "short",
    message: "🟡 [Mean Reversion] Цена выше нормы. Ожидается возврат к MA."
  },
  {
    name: "Dead Volume Fall",
    conditions: ["RSI_DROP", "VOLUME_DROP", "EMA_ANGLE_DOWN"],
    direction: "short",
    message: "🔻 [Dead Volume Fall] Объём падает на спаде — снижение может усилиться."
  }
];

module.exports = {
  comboStrategies
};
