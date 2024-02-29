const moment = require('moment')
const { getFilename } = require('./get-filename')
const { UNKNOWN } = require('../../constants/unknown')
const { DATE_FORMAT } = require('../../constants/date-format')
const { getStatus } = require('../shared/get-status')
const { getFrn } = require('../shared/get-frn')
const { getValue } = require('./get-value')
const { getSettledValue } = require('./get-settled-value')
const { PAYMENT_EXTRACTED, PAYMENT_SUBMITTED } = require('../../constants/events')
const { isImported } = require('./is-imported')
const { getPHError } = require('./get-ph-error')
const { getDaxError } = require('./get-dax-error')
const { getInvoiceNumber } = require('./get-invoice-number')
const { AR_REPORT } = require('../../constants/report-types')

const getReportLines = async (events, type) => {
  const reportLinePromises = events.map(async (event) => {
    const phError = await getPHError(event.events, event.correlationId)
    const daxError = await getDaxError(event.events, event.correlationId)
    const reportLine = {
      Filename: getFilename(event.events) ?? UNKNOWN,
      'Date Time': moment(event.events[event.events.length - 1].time).format(DATE_FORMAT),
      Event: getStatus(event.events),
      FRN: getFrn(event.events),
      'Invoice Number (Received in PH)': getInvoiceNumber(event.events, PAYMENT_EXTRACTED),
      'Invoice Value (Received in PH)': getValue(event.events, PAYMENT_EXTRACTED),
      'Invoice Number (Sent to D365)': getInvoiceNumber(event.events, PAYMENT_SUBMITTED),
      'Invoice Value (Sent to D365)': getValue(event.events, PAYMENT_SUBMITTED),
      'D365 Invoice Imported': isImported(event.events),
      'D365 Invoice Payment': getSettledValue(event.events),
      'PH Error Status': phError,
      'D365 Error Status': daxError
    }
    if (type === AR_REPORT) {
      delete reportLine['D365 Invoice Payment']
    }
    return reportLine
  })

  // Wait for all report line promises to resolve
  const reportLines = await Promise.all(reportLinePromises)
  return reportLines
}

module.exports = {
  getReportLines
}
