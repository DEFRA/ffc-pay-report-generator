const { FRN } = require('../values/frn')
const { INVOICE_NUMBER } = require('../values/invoice-number')
const { VALUE } = require('../values/value')
const { DATE } = require('../values/date')
const { PAYMENT_SETTLED_STATUS } = require('../../../app/constants/statuses')
const { FILENAME } = require('../values/filename')
const { PH_ERROR, D365_ERROR } = require('../values/errors')

module.exports = {
  Filename: FILENAME,
  'Date Time': DATE,
  Event: PAYMENT_SETTLED_STATUS,
  FRN,
  'Invoice Number (Received in PH)': INVOICE_NUMBER,
  'Invoice Value (Received in PH)': VALUE,
  'Invoice Number (Sent to D365)': INVOICE_NUMBER,
  'Invoice Value (Sent to D365)': VALUE,
  'D365 Invoice Imported': 'Y',
  'D365 Invoice Payment': VALUE,
  'PH Error Status': PH_ERROR,
  'D365 Error Status': D365_ERROR
}
