# 📘 SignalForge v2 — Крипто-сканер на Node.js

**SignalForge v2** — это backend-сканер криптовалютных сигналов, работающий по WebSocket и оптимизированный под хостинг на Render с минимальной нагрузкой.

---

## 🚀 Возможности

* Отбор топ-волатильных пар на Binance (по USDT)
* Подключение к свечам 5m / 15m / 1h через WebSocket
* Расчёт индикаторов: RSI, EMA, MACD, объём, FIBO
* Проверка комбинационных стратегий из шаблонов
* Вывод сигналов с пояснением и силой (weak/moderate/strong)
* Логирование и webhook-уведомления

---

## 📁 Структура проекта

```
/project-root
├── config/                # Все настройки проекта
├── core/                  # Вычисления и уровни FIBO
├── data/                  # JSON-файлы уровней
├── logic/                 # Основная логика сигналов
├── strategies/            # Готовые стратегии комбинаций
├── utils/                 # Логирование и утилиты
├── ws/                    # Работа с Binance WebSocket
├── logs/                  # Логи сигналов (если включено)
├── index.js               # Точка входа
└── package.json           # Зависимости
```

---

## ⚙️ Установка

1. Клонировать репозиторий:

```bash
git clone https://github.com/your-name/signalforge-v2.git
cd signalforge-v2
```

2. Установить зависимости:

```bash
npm install
```

3. Настроить `config/config.js` по своему усмотрению.

4. Запуск:

```bash
node index.js
```

---

## 🧠 Логика работы

1. `volatilitySelector.js`: отбирает топ-N волатильных USDT пар
2. `smartWSManager.js`: подписывает на свечи по 3 таймфреймам
3. `multiCandleCache.js`: собирает свечи в кэш
4. `strategyManager.js`: анализирует базовые индикаторы
5. `comboSignalEngine.js`: применяет комбинации и рекомендации
6. `signalScoring.js`: присваивает силу сигналу
7. `signalRecorder.js`: логирует и (если нужно) отправляет webhook

---

## 🧩 Пример стратегии (из `comboStrategies.js`)

```js
{
  name: "Double Confirmation",
  conditions: ["RSI_LOW", "EMA_CROSS_UP", "MACD_HIST_FLIP"],
  direction: "long",
  message: "🟢 Подтверждённый вход. RSI + EMA + MACD."
}
```

---

## 🔔 Пример лога

```
[comboLog] 📢 [Double Confirmation] Подтверждённый вход. RSI + EMA + MACD | BTCUSDT | TF: 5m | Сила: strong | Цена: 67250.00
```

---

## 🌐 Настройка под Render

* **Тип:** Web Service
* **Build Command:** *(оставить пустым)*
* **Start Command:** `node index.js`
* **Instance Type:** Starter (\$7/mo)
* **Environment:** Node 18+

---

## 📬 Настройка Webhook (опционально)

В `config.js`:

```js
ENABLE_WEBHOOK: true,
WEBHOOK_URL: 'https://your-webhook-url.com'
```

---

## 🧪 Режимы логов

* `'none'`: ничего кроме ошибок и сигналов
* `'basic'`: только ключевые действия (подписки, сигналы)
* `'verbose'`: все действия по свечам и расчётам

---

## 📌 Зависимости

* `technicalindicators`
* `ws`
* `axios`

---

## 🛟 Поддержка

Если у тебя есть идеи, баги или предложения — создавай Issue или Pull Request. Проект открыт для улучшений и доработок!

---

## 🧠 Автор

**Разработчик:** Антон (SignalForge Architect)

**Цель проекта:** создать автономный, модульный, читаемый и расширяемый инструмент для отбора точек входа на крипторынке.
