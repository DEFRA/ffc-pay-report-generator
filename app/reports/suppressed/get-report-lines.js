const moment = require('moment')
const { DATE_FORMAT } = require('../../constants/date-format')

const getReportLines = (events) => {
  return events
    .sort((x, y) => x.time - y.time)
    .map(event => ({
      frn: event.partitionKey,
      agreementNumber: event.data.agreementNumber,
      deltaValue: event.data.deltaValue,
      creditAP: event.data.creditAP,
      suppressedAR: event.data.suppressedAR,
      suppressed: moment(event.time).format(DATE_FORMAT)
    }))
}

module.exports = {
  getReportLines
}
