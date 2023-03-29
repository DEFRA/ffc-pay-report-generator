const getInvoiceNumber = (events) => {
  const enrichmentEvent = events.find(event => event.type === 'uk.gov.defra.ffc.pay.payment.enriched')
  if (enrichmentEvent) {
    return enrichmentEvent.data.invoiceNumber
  }
  return events[0].data.invoiceNumber ?? 'Unknown'
}

module.exports = {
  getInvoiceNumber
}
