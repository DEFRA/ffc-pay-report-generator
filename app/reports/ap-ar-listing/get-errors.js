const { odata } = require('../../storage')
const { PAYMENT_SETTLED, PAYMENT_ACKNOWLEDGED } = require('../../constants/events')
const { getWarnings } = require('./get-warnings')
const { DAX_REJECTED, BANK_MISSING } = require('../../constants/dax-warnings')
const { getFrn } = require('../shared/get-frn')
const { getFilename } = require('./get-filename')

const getErrors = async (events, correlationId) => {
  let phError
  let daxError
  const settledEvent = events.find(event => event.type === PAYMENT_SETTLED)
  if (!settledEvent) {
    let warnings
    const frn = getFrn(events)
    const filename = getFilename(events)
    const acknowledgedEvent = events.find(event => event.type === PAYMENT_ACKNOWLEDGED)
    if (acknowledgedEvent) {
      warnings = await getWarnings(odata`type in (${DAX_REJECTED}, ${BANK_MISSING})`)
    } else {
      warnings = await getWarnings()
    }
    if (warnings) {
      for (const warning of warnings) {
        if ((warning.data.correlationId === correlationId || warning.data.frn === frn) && (warning.type === DAX_REJECTED || warning.type === BANK_MISSING)) {
          daxError = warning.data.message
        } else if (!acknowledgedEvent && (warning.data.correlationId === correlationId || warning.subject === filename)) {
          phError = warning.data.message
        }
      }
    }
  }
  return { phError, daxError }
}

module.exports = {
  getErrors
}
