const { PAYMENT_PAUSED_PREFIX, PAYMENT_LEDGER_PREFIX } = require('../../constants/request-editor-prefixes')

const routedToRequestEditor = (events) => {
  const lastEvent = events[events.length - 1].type
  if (lastEvent.includes(PAYMENT_PAUSED_PREFIX) || lastEvent.includes(PAYMENT_LEDGER_PREFIX)) {
    return 'Y'
  }
  return 'N'
}

module.exports = {
  routedToRequestEditor
}
