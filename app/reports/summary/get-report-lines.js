const moment = require('moment')
const { TRANSACTION } = require('../../constants/transaction')
const { UNKNOWN } = require('../../constants/unknown')
const { getBatchExportDate } = require('../shared/get-batch-export-date')
const { getClaimAmount } = require('./get-claim-amount')
const { getDeltaAmount } = require('./get-delta-amount')
const { getYear } = require('./get-year')
const { getFrn } = require('../shared/get-frn')
const { getInvoiceNumber } = require('../shared/get-invoice-number')
const { getCurrency } = require('../shared/get-currency')
const { routedToRequestEditor } = require('./routed-to-request-editor')
const { getAPAmount } = require('./get-ap-amount')
const { getARAmount } = require('./get-ar-amount')
const { getDebtType } = require('./get-debt-type')
const { DATE_FORMAT } = require('../../constants/date-format')
const { getCPATStatus } = require('./get-cpat-status')
const { getRevenue } = require('./get-revenue')

const getReportLines = async (events) => {
  const reportLinePromises = events.map(async (event) => {
    const statusPromise = getCPATStatus(event.events)
    const status = await statusPromise
    return {
      ID: event.correlationId,
      FRN: getFrn(event.events),
      'Claim ID': event.events[0].data.contractNumber ?? UNKNOWN,
      'Agreement Number': event.events[0].data.agreementNumber,
      'Revenue / Capital': getRevenue(event.events),
      Year: getYear(event.events),
      'Invoice Number': getInvoiceNumber(event.events),
      'Payment Currency': getCurrency(event.events),
      'Payment Request Number': event.events[0].data.paymentRequestNumber,
      'Full Claim Amount': getClaimAmount(event.events) ?? UNKNOWN,
      'Batch ID': event.events[0].data.batch ?? TRANSACTION,
      'Batch Creator ID': event.events[0].data.sourceSystem,
      'Batch Export Date': getBatchExportDate(event.events),
      'Routed To Request Editor': routedToRequestEditor(event.events),
      'Delta Amount': getDeltaAmount(event.events, events) ?? UNKNOWN,
      'AP Amount': getAPAmount(event.events) ?? UNKNOWN,
      'AR Amount': getARAmount(event.events) ?? UNKNOWN,
      'Admin Or Irregular': getDebtType(event.events),
      Status: status,
      'Last Updated': moment(event.events[event.events.length - 1].time).format(DATE_FORMAT)
    }
  })

  // Wait for all report line promises to resolve
  const reportLines = await Promise.all(reportLinePromises)
  return reportLines
}

module.exports = {
  getReportLines
}
