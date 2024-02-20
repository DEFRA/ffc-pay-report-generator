const { PAYMENT_PROCESSED } = require('../../constants/events')

const getAPAmount = (events) => {
  const processingEvents = events.filter(event => event.type === PAYMENT_PROCESSED)
  if (processingEvents.length > 0) {
    let amount = 0
    for (const event of processingEvents) {
      if (event.data.ledger === 'AP') {
        amount += event.data.value
      }
    }
    return amount
  }
  return null
}

module.exports = {
  getAPAmount
}
