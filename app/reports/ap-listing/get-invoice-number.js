const { UNKNOWN } = require('../../constants/unknown')

const getInvoiceNumber = (events, type) => {
  const event = events.find(event => event.type === type)
  if (event) {
    return event.data.invoiceNumber
  }
  return UNKNOWN
}

module.exports = {
  getInvoiceNumber
}
