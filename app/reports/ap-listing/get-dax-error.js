const { odata } = require('../../storage')
const { PAYMENT_SETTLED } = require('../../constants/events')
const { getWarning } = require('./get-warning')
const { DAX_REJECTED, BANK_MISSING } = require('../../constants/dax-warnings')
const { getFrn } = require('../shared/get-frn')

const getDaxError = async (events, correlationId) => {
  const settledEvent = events.find(event => event.type === PAYMENT_SETTLED)
  if (settledEvent) {
    return null
  }
  const rejectedFilter = odata`type eq ${DAX_REJECTED} and JSON.parse(data).correlationId eq ${correlationId}`
  const rejected = await getWarning(rejectedFilter)
  if (rejected) {
    return rejected.data.message ?? null
  }
  const frn = getFrn(events)
  const bankFilter = odata`type eq ${BANK_MISSING} and JSON.parse(data).frn eq ${frn}`
  const bankMissing = await getWarning(bankFilter)
  if (bankMissing) {
    return bankMissing.data.message ?? null
  }
  return null
}

module.exports = {
  getDaxError
}
