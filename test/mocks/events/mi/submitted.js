const { PAYMENT_SUBMITTED } = require('../../../../app/constants/events')
const event = require('./event')

module.exports = {
  ...event,
  type: PAYMENT_SUBMITTED
}
