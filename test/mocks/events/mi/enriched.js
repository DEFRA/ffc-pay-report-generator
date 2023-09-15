const { PAYMENT_ENRICHED } = require('../../../../app/constants/events')
const event = require('./event')

module.exports = {
  ...event,
  type: PAYMENT_ENRICHED
}
