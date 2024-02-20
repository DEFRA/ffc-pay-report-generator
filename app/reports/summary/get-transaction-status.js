const { PAYMENT_PAUSED_DEBT_STATUS, PAYMENT_PAUSED_LEDGER_STATUS, PAYMENT_ENRICHED_STATUS } = require('../../constants/statuses')
const { getStatus } = require('../shared/get-status')
const { HOLD_EVENT } = require('../../constants/event-types')
const { getClient, odata } = require('../../storage')
const { getFrn } = require('../shared/get-frn')

const getTransactionStatus = async (events) => {
  const status = getStatus(events)
  if (status === PAYMENT_ENRICHED_STATUS) {
    // if a payment is stuck here it may be due to a hold
    const schemeId = events[0].data.schemeId
    const frn = getFrn(events)
    const client = getClient(HOLD_EVENT)
    const eventResults = client.listEntities({ queryOptions: { filter: odata`category eq 'frn' and type eq 'uk.gov.defra.ffc.pay.hold.added'` } })
    for await (const event of eventResults) {
      event.data = JSON.parse(event.data)
      if (event.data.schemeId === schemeId && event.data.frn === frn) {
        return 'Payment placed on hold'
      }
    }
  }
  if (status === PAYMENT_PAUSED_DEBT_STATUS) {
    return 'In request editor - Operations team'
  }
  if (status === PAYMENT_PAUSED_LEDGER_STATUS) {
    return 'In request editor - CPAT'
  }
  return status
}

module.exports = {
  getTransactionStatus
}
