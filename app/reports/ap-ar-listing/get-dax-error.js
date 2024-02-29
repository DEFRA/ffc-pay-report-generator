const { odata } = require('../../storage')
const { PAYMENT_SETTLED } = require('../../constants/events')
const { getWarnings } = require('./get-warnings')
const { DAX_REJECTED, BANK_MISSING } = require('../../constants/dax-warnings')
const { getFrn } = require('../shared/get-frn')

const getDaxError = async (events, correlationId) => {
  const settledEvent = events.find(event => event.type === PAYMENT_SETTLED)
  if (settledEvent) {
    return null
  }
  const rejectedFilter = odata`type eq ${DAX_REJECTED}`
  const rejectedWarnings = await getWarnings(rejectedFilter)
  if (rejectedWarnings) {
    for (const warning of rejectedWarnings) {
      if (warning.data.correlationId === correlationId) {
        return warning.data.message ?? null
      }
    }
  }
  const frn = getFrn(events)
  const bankFilter = odata`type eq ${BANK_MISSING}`
  const bankWarnings = await getWarnings(bankFilter)
  if (bankWarnings) {
    for (const warning of rejectedWarnings) {
      if (warning.data.frn === frn) {
        return warning.data.message ?? null
      }
    }
  }
  return null
}

module.exports = {
  getDaxError
}
