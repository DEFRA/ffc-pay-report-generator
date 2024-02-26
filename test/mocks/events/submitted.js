const { PAYMENT_SUBMITTED } = require('../../../app/constants/events')
const { FILENAME } = require('../values/filename')
const event = require('./event')

module.exports = {
  ...event,
  type: PAYMENT_SUBMITTED,
  subject: FILENAME
}
