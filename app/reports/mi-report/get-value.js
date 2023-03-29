const { convertToPence } = require('../../currency-convert')

const getValue = (events) => {
  const enrichmentEvent = events.find(event => event.type === 'uk.gov.defra.ffc.pay.payment.enriched')
  if (enrichmentEvent) {
    return enrichmentEvent.data.value
  }
  const extractedEvent = events.find(event => event.type === 'uk.gov.defra.ffc.pay.payment.extracted')
  if (extractedEvent) {
    return convertToPence(extractedEvent.data.value)
  }
  return convertToPence(events[0].data.value)
}

module.exports = {
  getValue
}
