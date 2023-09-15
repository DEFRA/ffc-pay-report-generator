const { PAYMENT_SUPPRESSED } = require('../../../../app/constants/events')
const event = require('./event')

module.exports = {
  ...event,
  type: PAYMENT_SUPPRESSED
}
