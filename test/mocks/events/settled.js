const { PAYMENT_SETTLED } = require('../../../app/constants/events')
const event = require('./event')

module.exports = {
  ...event,
  type: PAYMENT_SETTLED
}
