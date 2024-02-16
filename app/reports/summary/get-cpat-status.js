const { PAYMENT_PAUSED_DEBT_STATUS, PAYMENT_PAUSED_LEDGER_STATUS } = require('../../constants/statuses')
const { getStatus } = require('../shared/get-status')

const getCPATStatus = (events) => {
  const status = getStatus(events)
  if (status === PAYMENT_PAUSED_DEBT_STATUS) {
    return 'In request editor - Operations team'
  }
  if (status === PAYMENT_PAUSED_LEDGER_STATUS) {
    return 'In request editor - CPAT'
  }
  return status
}

module.exports = {
  getCPATStatus
}
