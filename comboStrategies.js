const comboStrategies = [
  {
    name: "Momentum Rebound",
    conditions: ["RSI_OVERBOUGHT", "EMA_ANGLE", "VOLUME_SPIKE"],
    direction: "long",
     message: (symbol, timeframe) =>
    `🟢 [Momentum Rebound] для ${symbol} на ${timeframe} — Возможен быстрый отскок. Вход по рынку.`
  },
  {
    name: "Volume Breakout",
    conditions: ["BREAKOUT", "VOLUME_SPIKE", "ADX_TREND"],
    direction: "long",
    message: (symbol, timeframe) =>
    `📈 [Volume Breakout] для ${symbol} на ${timeframe} — Пробой с объёмом. Рассматривай вход на импульсе.`
  },
  {
    name: "Exhaustion Top",
    conditions: ["RSI_OVERBOUGHT", "VOLUME_SPIKE", "DOJI"],
    direction: "short",
    message: (symbol, timeframe) =>
    `🔻 [Exhaustion Top] для ${symbol} на ${timeframe} — Перекупленность и выгорание — возможен разворот.`
  },
  {
    name: "Bullish Divergence",
    conditions: ["RSI_HIDDEN_BULL", "MACD_DIVERGENCE"],
    direction: "long",
    message: (symbol, timeframe) =>
    `🟢 [Bullish Divergence] для ${symbol} на ${timeframe} — Дивергенция — возможен отскок вверх.`
  },
  {
    name: "Mean Reversion Setup",
    conditions: ["MEAN_REVERS_UP", "VOLUME_DROP"],
    direction: "short",
    message: (symbol, timeframe) =>
    `🟡 [Mean Reversion] для ${symbol} на ${timeframe} — Цена выше нормы. Ожидается возврат к MA.`
  },
  {
    name: "Dead Volume Fall",
    conditions: ["RSI_DROP", "VOLUME_DROP", "EMA_ANGLE"],
    direction: "short",
    message: (symbol, timeframe) =>
    `🔻 [Dead Volume Fall] для ${symbol} на ${timeframe} — Объём падает на спаде — снижение может усилиться.`
  }
];

module.exports = {
  comboStrategies
};
