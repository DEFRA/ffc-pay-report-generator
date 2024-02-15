const { PAYMENT_LEDGER_ASSIGNED } = require('../../../app/constants/events')
const event = require('./event')

module.exports = {
  ...event,
  type: PAYMENT_LEDGER_ASSIGNED
}
