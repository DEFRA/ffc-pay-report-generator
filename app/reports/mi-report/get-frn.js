const { PAYMENT_ENRICHED } = require('../../constants/events')
const { UNKNOWN } = require('../../constants/unknown')

const getFrn = (events) => {
  const enrichmentEvent = events.find(event => event.type === PAYMENT_ENRICHED)
  if (enrichmentEvent) {
    return enrichmentEvent.data.frn
  }
  return events[0]?.data.frn ?? UNKNOWN
}

module.exports = {
  getFrn
}
