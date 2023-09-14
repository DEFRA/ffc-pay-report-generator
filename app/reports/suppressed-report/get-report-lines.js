const moment = require('moment')
const { DATE_FORMAT } = require('../../constants/date-format')
const { TRANSACTION } = require('../../constants/transaction')
const { UNKNOWN } = require('../../constants/unknown')

const getReportLines = (events) => {
  return events.map(event => ({
    id: event.data.correlationId,
    frn: event.data.frn,
    agreementNumber: event.data.agreementNumber,
    deltaValue: event.data.deltaValue,
    creditAP: event.data.creditAP,
    suppressedAR: event.data.suppressedAR,
    lastUpdated: moment(event.time).format(DATE_FORMAT)
  }))
}

module.exports = {
  getReportLines
}
