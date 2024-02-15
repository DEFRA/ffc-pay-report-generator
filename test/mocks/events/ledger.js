const { PAYMENT_PAUSED_LEDGER } = require('../../../app/constants/events')
const event = require('./event')

module.exports = {
  ...event,
  type: PAYMENT_PAUSED_LEDGER
}
