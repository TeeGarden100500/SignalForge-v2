function sendWebhook(symbol, results, interval) {
  console.log(`📤 Webhook: ${symbol} ${interval}`, results);
}
module.exports = { sendWebhook };
