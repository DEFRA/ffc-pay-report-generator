const { PAYMENT_ENRICHED, PAYMENT_EXTRACTED } = require('../../constants/events')
const { convertToPence } = require('../../currency-convert')

const getValue = (events) => {
  const enrichmentEvent = events.find(event => event.type === PAYMENT_ENRICHED)
  if (enrichmentEvent) {
    return enrichmentEvent.data.value
  }
  const extractedEvent = events.find(event => event.type === PAYMENT_EXTRACTED)
  if (extractedEvent) {
    return convertToPence(extractedEvent.data.value)
  }
  return events[0].data.value
}

module.exports = {
  getValue
}
