const { PAYMENT_PAUSED_LEDGER, PAYMENT_PROCESSED } = require('../../constants/events')

const getDebtType = (events) => {
  const ledgerEvent = events.find(event => event.type === PAYMENT_PAUSED_LEDGER)
  if (ledgerEvent) {
    return formatDebtType(ledgerEvent.data.debtType)
  }
  const processedEvent = events.find(event => event.type === PAYMENT_PROCESSED)
  if (processedEvent) {
    return formatDebtType(processedEvent.data.debtType)
  }
  return null
}

const formatDebtType = (type) => {
  if (type === 'irr') {
    return 'Irregular'
  } else if (type === 'adm') {
    return 'Administrative'
  }
  return null
}

module.exports = {
  getDebtType
}
