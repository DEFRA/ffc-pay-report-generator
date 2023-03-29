const moment = require('moment')

const getBatchExportDate = (events) => {
  const extractedEvent = events.find(event => event.type === 'uk.gov.defra.ffc.pay.payment.extracted')
  if (extractedEvent) {
    return moment(extractedEvent.time).format('DD/MM/YYYY')
  }
  return ''
}

module.exports = {
  getBatchExportDate
}
