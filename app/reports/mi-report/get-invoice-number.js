const { PAYMENT_ENRICHED } = require('../../constants/events')

const getInvoiceNumber = (events) => {
  const enrichmentEvent = events.find(event => event.type === PAYMENT_ENRICHED)
  if (enrichmentEvent) {
    return enrichmentEvent.data.invoiceNumber
  }
  return events[0]?.data.invoiceNumber ?? 'Unknown'
}

module.exports = {
  getInvoiceNumber
}
