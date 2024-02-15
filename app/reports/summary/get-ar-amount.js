const { PAYMENT_PROCESSED } = require('../../constants/events')

const getARAmount = (events) => {
  const processingEvents = events.filter(event => event.type === PAYMENT_PROCESSED)
  if (processingEvents.length > 0) {
    let amount = 0
    for (const event of processingEvents) {
      if (event.data.ledger === 'AR') {
        amount -= event.data.value
      }
    }
    return amount
  }
  return null
}

module.exports = {
  getARAmount
}
