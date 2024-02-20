const { getClaimAmount } = require('./get-claim-amount')

const getDeltaAmount = (events, fullEvents) => {
  const requestNumber = events[0]?.data.paymentRequestNumber
  const previousRequest = fullEvents.filter(eventsById => eventsById.events[0]?.data.paymentRequestNumber === (requestNumber - 1) && eventsById.events[0]?.data.frn === events[0]?.data.frn && eventsById.events[0]?.data.agreementNumber === events[0]?.data.agreementNumber)
  if (previousRequest.length > 0) {
    return getClaimAmount(events) - getClaimAmount(previousRequest[0].events)
  }
  return getClaimAmount(events)
}

module.exports = {
  getDeltaAmount
}
