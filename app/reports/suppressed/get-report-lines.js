const moment = require('moment')
const { DATE_FORMAT } = require('../../constants/date-format')
const { convertToPounds } = require('../../currency-convert')

const getReportLines = (events) => {
  return events
    .sort((x, y) => (x.time || 0) - (y.time || 0))
    .map(event => {
      const data = event.data || {}
      return {
        frn: event.PartitionKey,
        agreementNumber: data.agreementNumber,
        marketingYear: data.marketingYear,
        paymentRequestNumber: data.paymentRequestNumber,
        deltaValue: convertToPounds(data.deltaValue || 0),
        creditAP: convertToPounds(data.creditAP || 0),
        suppressedAR: convertToPounds(data.suppressedAR || 0),
        suppressed: moment(event.time).format(DATE_FORMAT)
      }
    })
}

module.exports = { getReportLines }
