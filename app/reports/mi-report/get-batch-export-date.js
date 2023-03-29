const moment = require('moment')
const { PAYMENT_EXTRACTED } = require('../../constants/events')

const getBatchExportDate = (events) => {
  const extractedEvent = events.find(event => event.type === PAYMENT_EXTRACTED)
  if (extractedEvent) {
    return moment(extractedEvent.time).format('DD/MM/YYYY')
  }
  return ''
}

module.exports = {
  getBatchExportDate
}
