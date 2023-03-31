const { DATA_CONTENT_TYPE } = require('../values/data-content-type')
const { ID } = require('../values/id')
const { SOURCE } = require('../values/source')
const { SPEC_VERSION } = require('../values/spec-version')
const { TIME } = require('../values/time')
const { TYPE } = require('../values/type')
const { CORRELATION_ID } = require('../values/correlation-id')
const { FRN } = require('../values/frn')
const { INVOICE_NUMBER } = require('../values/invoice-number')
const { SCHEME_ID } = require('../values/scheme-id')
const { CONTRACT_NUMBER } = require('../values/contract-number')
const { BATCH } = require('../values/batch')

module.exports = {
  specversion: SPEC_VERSION,
  type: TYPE,
  source: SOURCE,
  id: ID,
  time: TIME,
  datacontenttype: DATA_CONTENT_TYPE,
  data: {
    frn: FRN,
    correlationId: CORRELATION_ID,
    schemeId: SCHEME_ID,
    invoiceNumber: INVOICE_NUMBER,
    contractNumber: CONTRACT_NUMBER,
    batch: BATCH
  }
}
