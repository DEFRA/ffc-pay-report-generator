const { PAYMENT_ENRICHED } = require('../../constants/events')

const getCurrency = (events) => {
  const enrichmentEvent = events.find(event => event.type === PAYMENT_ENRICHED)
  if (enrichmentEvent) {
    return enrichmentEvent.data.currency
  }
  return events[0]?.data.currency ?? 'Unknown'
}

module.exports = {
  getCurrency
}
