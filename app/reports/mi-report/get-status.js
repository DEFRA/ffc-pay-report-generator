const {
  PAYMENT_EXTRACTED,
  PAYMENT_ENRICHED,
  PAYMENT_PAUSED_DEBT,
  PAYMENT_DEBT_ATTACHED,
  PAYMENT_PAUSED_LEDGER,
  PAYMENT_LEDGER_ASSIGNED,
  PAYMENT_PAUSED_QUALITY_CHECK,
  PAYMENT_FAILED_QUALITY_CHECK,
  PAYMENT_PASSED_QUALITY_CHECK,
  PAYMENT_PROCESSED,
  PAYMENT_SUBMITTED,
  PAYMENT_ACKNOWLEDGED,
  PAYMENT_SETTLED
} = require('../../constants/events')

const getStatus = (events) => {
  const eventMap = {}
  eventMap[PAYMENT_EXTRACTED] = 'Batch received'
  eventMap[PAYMENT_ENRICHED] = 'Request enriched for downstream processing'
  eventMap[PAYMENT_PAUSED_DEBT] = 'Waiting for debt data'
  eventMap[PAYMENT_DEBT_ATTACHED] = 'Debt data attached'
  eventMap[PAYMENT_PAUSED_LEDGER] = 'Waiting for ledger assignment'
  eventMap[PAYMENT_LEDGER_ASSIGNED] = 'Ledger assigned'
  eventMap[PAYMENT_PAUSED_QUALITY_CHECK] = 'Waiting for ledger assignment quality check'
  eventMap[PAYMENT_FAILED_QUALITY_CHECK] = 'Ledger assignment quality check failed, waiting for correction'
  eventMap[PAYMENT_PASSED_QUALITY_CHECK] = 'Ledger assignment quality check passed'
  eventMap[PAYMENT_PROCESSED] = 'Payment processed'
  eventMap[PAYMENT_SUBMITTED] = 'Submitted to D365'
  eventMap[PAYMENT_ACKNOWLEDGED] = 'Acknowledged by D365'
  eventMap[PAYMENT_SETTLED] = 'Settled by D365'
  const lastEvent = events[events.length - 1]
  return eventMap[lastEvent.type]
}

module.exports = {
  getStatus
}
