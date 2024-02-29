const { PAYMENT_SETTLED } = require('../../constants/events')

const getSettledValue = (events) => {
  const event = events.find(event => event.type === PAYMENT_SETTLED)
  if (event) {
    return event.data.settledValue
  }
  return null
}

module.exports = {
  getSettledValue
}
