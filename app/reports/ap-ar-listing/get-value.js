const { PAYMENT_EXTRACTED } = require('../../constants/events')

const getValue = (events, type) => {
  const event = events.find(event => event.type === type)
  if (event) {
    if (type === PAYMENT_EXTRACTED) {
      return event.data.value * 100
    }
    return event.data.value
  }
  return null
}

module.exports = {
  getValue
}
