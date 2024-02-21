const { DAX_REJECTED } = require('../../../app/constants/dax-warnings')
const { CORRELATION_ID } = require('../values/correlation-id')
const { FRN } = require('../values/frn')

module.exports = {
  type: DAX_REJECTED,
  data: {
    frn: FRN,
    correlationId: CORRELATION_ID,
    message: 'An error occurred'
  }
}
