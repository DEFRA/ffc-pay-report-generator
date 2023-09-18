const { CORRELATION_ID } = require('../values/correlation-id')
const { FRN } = require('../values/frn')
const { CONTRACT_NUMBER } = require('../values/contract-number')
const { AGREEMENT_NUMBER } = require('../values/agreement-number')
const { MARKETING_YEAR } = require('../values/marketing-year')
const { INVOICE_NUMBER } = require('../values/invoice-number')
const { CURRENCY } = require('../values/currency')
const { PAYMENT_REQUEST_NUMBER } = require('../values/payment-request-number')
const { VALUE } = require('../values/value')
const { BATCH } = require('../values/batch')
const { SOURCE_SYSTEM } = require('../values/source-system')
const { DATE } = require('../values/date')
const { PAYMENT_ENRICHED_STATUS } = require('../../../app/constants/statuses')

module.exports = {
  id: CORRELATION_ID,
  frn: FRN,
  claimNumber: CONTRACT_NUMBER,
  agreementNumber: AGREEMENT_NUMBER,
  schemeYear: MARKETING_YEAR,
  invoiceNumber: INVOICE_NUMBER,
  preferredPaymentCurrency: CURRENCY,
  paymentInvoiceNumber: PAYMENT_REQUEST_NUMBER,
  totalAmount: VALUE,
  batchId: BATCH,
  batchCreatorId: SOURCE_SYSTEM,
  batchExportDate: DATE,
  status: PAYMENT_ENRICHED_STATUS,
  lastUpdated: DATE
}
