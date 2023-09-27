const moment = require('moment')
const { DATE_FORMAT } = require('../../constants/date-format')
const { convertToPounds } = require('../../currency-convert')

const getReportLines = (events) => {
  return events
    .sort((x, y) => x.time - y.time)
    .map(event => ({
      frn: event.partitionKey,
      agreementNumber: event.data.agreementNumber,
      marketingYear: event.data.marketingYear,
      paymentRequestNumber: event.data.paymentRequestNumber,
      deltaValue: convertToPounds(event.data.deltaValue),
      creditAP: convertToPounds(event.data.creditAP),
      suppressedAR: event.data.suppressedAR,
      suppressed: moment(event.time).format(DATE_FORMAT)
    }))
}

module.exports = {
  getReportLines
}
