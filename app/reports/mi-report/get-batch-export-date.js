const moment = require('moment')
const { DATE_FORMAT } = require('../../constants/date-format')
const { PAYMENT_EXTRACTED } = require('../../constants/events')

const getBatchExportDate = (events) => {
  const extractedEvent = events.find(event => event.type === PAYMENT_EXTRACTED)
  if (extractedEvent) {
    return moment(extractedEvent.time).format(DATE_FORMAT)
  }
  return ''
}

module.exports = {
  getBatchExportDate
}
