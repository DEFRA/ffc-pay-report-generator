const { PAYMENT_ACKNOWLEDGED } = require('../../../app/constants/events')
const event = require('./event')

module.exports = {
  ...event,
  type: PAYMENT_ACKNOWLEDGED
}
