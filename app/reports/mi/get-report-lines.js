const moment = require('moment')
const { DATE_FORMAT } = require('../../constants/date-format')
const { TRANSACTION } = require('../../constants/transaction')
const { UNKNOWN } = require('../../constants/unknown')
const { getBatchExportDate } = require('../shared/get-batch-export-date')
const { getCurrency } = require('../shared/get-currency')
const { getFrn } = require('../shared/get-frn')
const { getInvoiceNumber } = require('../shared/get-invoice-number')
const { getStatus } = require('../shared/get-status')
const { getValue } = require('./get-value')

const getReportLines = (events) => {
  return events.map(event => ({
    id: event.correlationId,
    frn: getFrn(event.events),
    claimNumber: event.events[0].data.contractNumber ?? UNKNOWN,
    agreementNumber: event.events[0].data.agreementNumber,
    schemeYear: event.events[0].data.marketingYear,
    invoiceNumber: getInvoiceNumber(event.events),
    preferredPaymentCurrency: getCurrency(event.events),
    paymentInvoiceNumber: event.events[0].data.paymentRequestNumber,
    totalAmount: getValue(event.events),
    batchId: event.events[0].data.batch ?? TRANSACTION,
    batchCreatorId: event.events[0].data.sourceSystem,
    batchExportDate: getBatchExportDate(event.events),
    status: getStatus(event.events),
    lastUpdated: moment(event.events[event.events.length - 1].time).format(DATE_FORMAT)
  }))
}

module.exports = {
  getReportLines
}
