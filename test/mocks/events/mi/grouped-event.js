const { CORRELATION_ID } = require('../../values/correlation-id')
const event = require('./event')

module.exports = {
  correlationId: CORRELATION_ID,
  events: [event]
}
