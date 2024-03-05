const { PAYMENT_SETTLED } = require('../../constants/events')
const { getWarnings } = require('./get-warnings')
const { getFrn } = require('../shared/get-frn')
const { getFilename } = require('./get-filename')
const { PAYMENT_DAX_REJECTED, PAYMENT_INVALID_BANK } = require('../../constants/warnings')
const { PAYMENT_ACKNOWLEDGED } = require('../../constants/events')

const getErrors = async (events, correlationId) => {
  let phError
  let daxError
  const settledEvent = events.find(event => event.type === PAYMENT_SETTLED)
  if (!settledEvent) {
    const acknowledgedEvent = events.find(event => event.type === PAYMENT_ACKNOWLEDGED)
    const warnings = getWarnings(events, acknowledgedEvent)
    const frn = getFrn(events)
    const filename = getFilename(events)
    for (const warning of warnings) {
      if ((warning.data.correlationId === correlationId || warning.data.frn === frn) && (warning.type === PAYMENT_DAX_REJECTED || warning.type === PAYMENT_INVALID_BANK)) {
        daxError = warning.data.message
      } else if (!acknowledgedEvent && (warning.data.correlationId === correlationId || warning.subject === filename)) {
        phError = warning.data.message
      }
    }
  }
  return { phError, daxError }
}

module.exports = {
  getErrors
}
