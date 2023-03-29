const getCurrency = (events) => {
  const enrichmentEvent = events.find(event => event.type === 'uk.gov.defra.ffc.pay.payment.enriched')
  if (enrichmentEvent) {
    return enrichmentEvent.data.currency
  }
  return events[0].data.currency ?? 'Unknown'
}

module.exports = {
  getCurrency
}
