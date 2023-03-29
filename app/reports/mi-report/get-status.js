const getStatus = (events) => {
  const eventMap = {
    'uk.gov.defra.ffc.pay.payment.extracted': 'Batch received',
    'uk.gov.defra.ffc.pay.payment.enriched': 'Request enriched for downstream processing',
    'uk.gov.defra.ffc.pay.payment.paused.debt': 'Waiting for debt data',
    'uk.gov.defra.ffc.pay.payment.debt.attached': 'Debt data attached',
    'uk.gov.defra.ffc.pay.payment.paused.ledger': 'Waiting for ledger assignment',
    'uk.gov.defra.ffc.pay.payment.ledger.assigned': 'Ledger assigned',
    'uk.gov.defra.ffc.pay.payment.ledger.quality-check.pending': 'Waiting for ledger quality check',
    'uk.gov.defra.ffc.pay.payment.ledger.quality-check.failed': 'Ledger quality check failed, waiting for correction',
    'uk.gov.defra.ffc.pay.payment.ledger.quality-check.passed': 'Ledger quality check passed',
    'uk.gov.defra.ffc.pay.payment.processed': 'Final payment request state calculated',
    'uk.gov.defra.ffc.pay.payment.submitted': 'Submitted to D365',
    'uk.gov.defra.ffc.pay.payment.acknowledged': 'Acknowledged by D365',
    'uk.gov.defra.ffc.pay.payment.settled': 'Settled by D365'
  }
  const lastEvent = events[events.length - 1]
  return eventMap[lastEvent.type]
}

module.exports = {
  getStatus
}
