const { PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED } = require('../../constants/events')

const isImported = (events) => {
  const acknowledgedEvent = events.find(event => event.type === PAYMENT_ACKNOWLEDGED)
  const settledEvent = events.find(event => event.type === PAYMENT_SETTLED)
  if (acknowledgedEvent || settledEvent) {
    return 'Y'
  }
  return null
}

module.exports = {
  isImported
}
