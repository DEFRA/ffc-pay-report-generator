const moment = require('moment')
const { getBatchExportDate } = require('./get-batch-export-date')
const { getCurrency } = require('./get-currency')
const { getInvoiceNumber } = require('./get-invoice-line')
const { getStatus } = require('./get-status')
const { getValue } = require('./get-value')

const getReportLines = (events) => {
  return events.map(event => ({
    id: event.correlationId,
    frn: event.events[0].data.frn,
    claimNumber: event.events[0].data.claimNumber,
    agreementNumber: event.events[0].data.agreementNumber,
    schemeYear: event.events[0].data.marketingYear,
    invoiceNumber: getInvoiceNumber(event.events),
    preferredPaymentCurrency: getCurrency(event.events),
    paymentInvoiceNumber: event.events[0].data.paymentRequestNumber,
    totalAmount: getValue(event.events),
    batchId: event.events[0].data.batch ?? 'Transaction',
    batchCreatorId: event.events[0].data.sourceSystem,
    batchExportDate: getBatchExportDate(event.events),
    status: getStatus(event.events),
    lastUpdated: moment(event.events[event.events.length - 1].time).format('DD/MM/YYYY')
  }))
}

module.exports = {
  getReportLines
}
