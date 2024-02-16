const { PAYMENT_EXTRACTED } = require('../../constants/events')
const { convertToPence } = require('../../currency-convert')

const getClaimAmount = (events) => {
  const extractedEvent = events.find(event => event.type === PAYMENT_EXTRACTED)
  if (extractedEvent) {
    return convertToPence(extractedEvent.data.value)
  }
  // if no extractedEvent we should have events in pence value already.
  return events[0]?.data.value ?? null
}

module.exports = {
  getClaimAmount
}
