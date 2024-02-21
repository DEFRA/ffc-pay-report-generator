const { odata } = require('../../storage')
const { PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED } = require('../../constants/events')
const { getWarning } = require('./get-warning')

const getPHError = async (events, correlationId) => {
  const acknowledgedEvent = events.find(event => event.type === PAYMENT_ACKNOWLEDGED)
  const settledEvent = events.find(event => event.type === PAYMENT_SETTLED)
  if (acknowledgedEvent || settledEvent) {
    return null
  }
  const filter = odata`JSON.parse(data).correlationId eq ${correlationId}`
  const warning = await getWarning(filter)
  if (warning) {
    return warning.data.message ?? null
  }
  return null
}

module.exports = {
  getPHError
}
