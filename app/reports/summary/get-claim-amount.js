const { PAYMENT_EXTRACTED } = require('../../constants/events')
const { convertToPence } = require('../../currency-convert')

const getClaimAmount = (events) => {
  const extractedEvent = events.find(event => event.type === PAYMENT_EXTRACTED)
  if (extractedEvent) {
    return convertToPence(extractedEvent.data.value)
  }
  return null
}

module.exports = {
  getClaimAmount
}
