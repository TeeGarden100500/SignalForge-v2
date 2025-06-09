const { confirmShortReversalTrap } = require("./combo/shortReversalTrap");
const { COMBO_WEIGHTS } = require("./config");
const comboStrategies = [
  {
    name: "Momentum Rebound",
    conditions: ["RSI_OVERBOUGHT", "EMA_ANGLE", "VOLUME_SPIKE"],
    minMatch: 2,
    direction: "LONG",
    weight: COMBO_WEIGHTS["Momentum Rebound"] || 1,
    message: (symbol, tf) =>
      `COMBO [Momentum Rebound] для ${symbol} на ${tf} — Возможен быстрый отскок. Вход по рынку. ✅ LONG.`
  },
  {
    name: "Volume Breakout",
    conditions: ["BREAKOUT", "VOLUME_SPIKE", "ADX_TREND"],
    minMatch: 2,
    direction: "LONG",
    weight: COMBO_WEIGHTS["Volume Breakout"] || 1,
    message: (symbol, tf) =>
      `COMBO [Volume Breakout] для ${symbol} на ${tf} — Пробой с объёмом. Рассматривай вход на импульсе. ✅ LONG.`
  },
  {
    name: "Exhaustion Top",
    conditions: ["RSI_OVERBOUGHT", "VOLUME_SPIKE", "DOJI"],
    minMatch: 2,
    direction: "SHORT",
    weight: COMBO_WEIGHTS["Exhaustion Top"] || 1,
    message: (symbol, tf) =>
      `COMBO [Exhaustion Top] для ${symbol} на ${tf} — Перекупленность и выгорание — возможен разворот. ❌ SHORT.`
  },
  {
    name: "Bullish Divergence",
    conditions: ["RSI_HIDDEN_BULL", "MACD_DIVERGENCE"],
    minMatch: 2,
    direction: "LONG",
    weight: COMBO_WEIGHTS["Bullish Divergence"] || 1,
    message: (symbol, tf) =>
      `COMBO [Bullish Divergence] для ${symbol} на ${tf} — Дивергенция — возможен отскок вверх. ✅ LONG.`
  },
  {
    name: "Mean Reversion Setup",
    conditions: ["MEAN_REVERS_UP", "VOLUME_DROP"],
    minMatch: 2,
    direction: "SHORT",
    weight: COMBO_WEIGHTS["Mean Reversion Setup"] || 1,
    message: (symbol, tf) =>
      `COMBO [Mean Reversion] для ${symbol} на ${tf} — Цена выше нормы. Ожидается возврат к MA. ❌ SHORT.`
  },
  {
    name: "Dead Volume Fall",
    conditions: ["RSI_DROP", "VOLUME_DROP", "EMA_ANGLE"],
    minMatch: 2,
    direction: "SHORT",
    weight: COMBO_WEIGHTS["Dead Volume Fall"] || 1,
    message: (symbol, tf) =>
      `COMBO [Dead Volume Fall] для ${symbol} на ${tf} — Объём падает на спаде — снижение может усилиться. ❌ SHORT.`
  },
  {
    name: "Short Reversal Trap",
    conditions: [
      "FLASH_CRASH_RECOVERY",
      "STOP_LOSS_HUNT",
      "VOLUME_TRAP",
      "RSI_OVERBOUGHT",
      "WICK_REJECTION"
    ],
    minMatch: 3,
    validator: confirmShortReversalTrap,
    direction: "SHORT",
    weight: COMBO_WEIGHTS["Short Reversal Trap"] || 1,
    message: (symbol, tf) =>
      `COMBO [Short Reversal Trap] для ${symbol} на ${tf} — Ложный импульс вверх и вынос ликвидности. Возможен откат. ❌ SHORT.`
  },
  {
    name: "Long Reversal Bounce",
    conditions: [
      "LIQUIDITY_REBOUND",
      "WICK_REJECTION",
      "FLASH_CRASH_RECOVERY",
      "VOLUME_SPIKE",
      "RSI_OVERSOLD"
    ],
    minMatch: 3,
    direction: "LONG",
    weight: COMBO_WEIGHTS["Long Reversal Bounce"] || 1,
    message: (symbol, tf) =>
      `COMBO [Long Reversal Bounce] для ${symbol} на ${tf} — Сильный отскок от зоны ликвидности. Возможен разворот. ✅ LONG.`
  }
];

module.exports = {
  comboStrategies
};
