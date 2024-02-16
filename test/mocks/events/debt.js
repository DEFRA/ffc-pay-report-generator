const { PAYMENT_PAUSED_DEBT } = require('../../../app/constants/events')
const event = require('./event')

module.exports = {
  ...event,
  type: PAYMENT_PAUSED_DEBT
}
