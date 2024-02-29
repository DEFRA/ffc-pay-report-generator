const { PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED } = require('../../constants/events')
const { getWarnings } = require('./get-warnings')
const { getFilename } = require('./get-filename')

const getPHError = async (events, correlationId) => {
  const acknowledgedEvent = events.find(event => event.type === PAYMENT_ACKNOWLEDGED)
  const settledEvent = events.find(event => event.type === PAYMENT_SETTLED)
  if (acknowledgedEvent || settledEvent) {
    return null
  }
  const filename = getFilename(events)
  const warnings = await getWarnings()
  if (warnings) {
    for (const warning of warnings) {
      if (warning.data.correlationId === correlationId || warning.subject === filename) {
        return warning.data.message ?? null
      }
    }
  }
  return null
}

module.exports = {
  getPHError
}
