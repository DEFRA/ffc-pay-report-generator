const { PAYMENT_PAUSED_DEBT, PAYMENT_PAUSED_LEDGER, PAYMENT_PAUSED_QUALITY_CHECK } = require('../../constants/events')

const routedToRequestEditor = (events) => {
  const pausedDebtEvent = events.find(event => event.type === PAYMENT_PAUSED_DEBT)
  const pausedLedgerEvent = events.find(event => event.type === PAYMENT_PAUSED_LEDGER)
  const pausedQCEvent = events.find(event => event.type === PAYMENT_PAUSED_QUALITY_CHECK)
  if (pausedDebtEvent || pausedLedgerEvent || pausedQCEvent) {
    return 'Y'
  }
  return 'N'
}

module.exports = {
  routedToRequestEditor
}
