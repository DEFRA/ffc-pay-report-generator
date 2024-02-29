const getInvoiceNumber = (events, type) => {
  const event = events.find(event => event.type === type)
  if (event) {
    return event.data.invoiceNumber
  }
  return null
}

module.exports = {
  getInvoiceNumber
}
