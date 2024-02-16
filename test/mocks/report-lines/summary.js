const { CORRELATION_ID } = require('../values/correlation-id')
const { FRN } = require('../values/frn')
const { CONTRACT_NUMBER } = require('../values/contract-number')
const { AGREEMENT_NUMBER } = require('../values/agreement-number')
const { MARKETING_YEAR: YEAR } = require('../values/marketing-year')
const { INVOICE_NUMBER } = require('../values/invoice-number')
const { CURRENCY } = require('../values/currency')
const { PAYMENT_REQUEST_NUMBER } = require('../values/payment-request-number')
const { VALUE } = require('../values/value')
const { BATCH } = require('../values/batch')
const { SOURCE_SYSTEM } = require('../values/source-system')
const { DATE } = require('../values/date')
const { PAYMENT_ENRICHED_STATUS } = require('../../../app/constants/statuses')
const { REVENUE } = require('../values/revenue')
const { DELTA_VALUE } = require('../values/delta-value')
const { ROUTED } = require('../values/routed')
const { ADMIN_IRREGULAR } = require('../values/admin-irregular')

module.exports = {
  ID: CORRELATION_ID,
  FRN,
  'Claim ID': CONTRACT_NUMBER,
  'Agreement Number': AGREEMENT_NUMBER,
  Revenue: REVENUE,
  Year: YEAR,
  'Invoice Number': INVOICE_NUMBER,
  'Payment Currency': CURRENCY,
  'Payment Request Number': PAYMENT_REQUEST_NUMBER,
  'Full Claim Amount': VALUE,
  'Batch ID': BATCH,
  'Batch Creator ID': SOURCE_SYSTEM,
  'Batch Export Date': DATE,
  'Routed To Request Editor': ROUTED,
  'Delta Amount': DELTA_VALUE,
  'AP Amount': DELTA_VALUE,
  'AR Amount': 0,
  'Admin Or Irregular': ADMIN_IRREGULAR,
  Status: PAYMENT_ENRICHED_STATUS,
  'Last Updated': DATE
}
