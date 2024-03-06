const { PAYMENT_SUBMITTED, PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED } = require('../../constants/events')

const getFilename = (events) => {
  const submittedEvent = events.find(event => event.type === PAYMENT_SUBMITTED)
  if (submittedEvent) {
    return submittedEvent.subject
  }
  const acknowledgedEvent = events.find(event => event.type === PAYMENT_ACKNOWLEDGED)
  if (acknowledgedEvent) {
    return acknowledgedEvent.data.batch
  }
  const settledEvent = events.find(event => event.type === PAYMENT_SETTLED)
  if (settledEvent) {
    return settledEvent.data.batch
  }
  return null
}

module.exports = {
  getFilename
}
