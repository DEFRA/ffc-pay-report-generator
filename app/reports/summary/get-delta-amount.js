const { PAYMENT_PROCESSED } = require('../../constants/events')

const getDeltaAmount = (events) => {
  const processingEvents = events.filter(event => event.type === PAYMENT_PROCESSED)
  if (processingEvents.length > 0) {
    let amount = 0
    for (const event of processingEvents) {
      amount += event.data.value
    }
    return amount
  }
  return null
}

module.exports = {
  getDeltaAmount
}
