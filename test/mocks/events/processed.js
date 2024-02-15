const { PAYMENT_PROCESSED } = require('../../../app/constants/events')
const event = require('./event')

module.exports = {
  ...event,
  type: PAYMENT_PROCESSED
}
