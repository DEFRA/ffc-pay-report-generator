const { PAYMENT_DAX_REJECTED, PAYMENT_INVALID_BANK, BATCH_REJECTED, BATCH_QUARANTINED, PAYMENT_REJECTED, PAYMENT_PROCESSING_FAILED, PAYMENT_SETTLEMENT_UNMATCHED, RESPONSE_REJECTED, PAYMENT_REQUEST_BLOCKED, PAYMENT_DAX_UNAVAILABLE, RECEIVER_CONNECTION_FAILED } = require('../../constants/warnings')
const { WARNING_EVENT } = require('../../constants/event-types')
const { getClient, odata } = require('../../storage')

const getWarnings = async (events, acknowledgedEvent) => {
  const warnings = []
  let filter
  if (acknowledgedEvent) {
    filter = odata`type eq ${PAYMENT_DAX_REJECTED} or type eq ${PAYMENT_INVALID_BANK}`
  } else {
    filter = odata`type eq ${BATCH_REJECTED} or type eq ${BATCH_QUARANTINED} or type eq ${PAYMENT_REJECTED} or type eq ${PAYMENT_PROCESSING_FAILED} or type eq ${PAYMENT_SETTLEMENT_UNMATCHED} or type eq ${RESPONSE_REJECTED} or type eq ${PAYMENT_REQUEST_BLOCKED} or type eq ${PAYMENT_DAX_UNAVAILABLE} or type eq ${RECEIVER_CONNECTION_FAILED}`
  }
  const client = getClient(WARNING_EVENT)
  const eventResults = client.listEntities({ queryOptions: { filter, orderby: odata`time asc` } })
  for await (const event of eventResults) {
    event.data = JSON.parse(event.data)
    warnings.push(event)
  }
  return warnings
}

module.exports = {
  getWarnings
}
