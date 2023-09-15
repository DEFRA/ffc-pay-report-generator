const { CORRELATION_ID } = require('./values/correlation-id')
const { FRN } = require('./values/frn')
const { AGREEMENT_NUMBER } = require('./values/agreement-number')
const { DATE } = require('./values/date')
const { DELTA_VALUE } = require('./values/delta-value')
const { CREDIT_AP } = require('./values/credit-ap')
const { SUPPRESSED_AR } = require('./values/suppressed-ar')

module.exports = {
  id: CORRELATION_ID,
  frn: FRN,
  agreementNumber: AGREEMENT_NUMBER,
  deltaValue: DELTA_VALUE,
  creditAP: CREDIT_AP,
  suppressedAR: SUPPRESSED_AR,
  lastUpdated: DATE
}
