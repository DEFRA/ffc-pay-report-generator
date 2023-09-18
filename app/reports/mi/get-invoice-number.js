const { PAYMENT_ENRICHED } = require('../../constants/events')
const { UNKNOWN } = require('../../constants/unknown')

const getInvoiceNumber = (events) => {
  const enrichmentEvent = events.find(event => event.type === PAYMENT_ENRICHED)
  if (enrichmentEvent) {
    return enrichmentEvent.data.invoiceNumber
  }
  return events[0]?.data.invoiceNumber ?? UNKNOWN
}

module.exports = {
  getInvoiceNumber
}
