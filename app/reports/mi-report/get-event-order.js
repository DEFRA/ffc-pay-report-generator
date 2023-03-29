const getEventOrder = (event) => {
  const eventOrder = {
    'uk.gov.defra.ffc.pay.payment.extracted': 1,
    'uk.gov.defra.ffc.pay.payment.enriched': 2,
    'uk.gov.defra.ffc.pay.payment.paused.debt': 3,
    'uk.gov.defra.ffc.pay.payment.debt.attached': 4,
    'uk.gov.defra.ffc.pay.payment.paused.ledger': 5,
    'uk.gov.defra.ffc.pay.payment.ledger.assigned': 6,
    'uk.gov.defra.ffc.pay.payment.ledger.quality-check.pending': 7,
    'uk.gov.defra.ffc.pay.payment.ledger.quality-check.failed': 8,
    'uk.gov.defra.ffc.pay.payment.ledger.quality-check.passed': 9,
    'uk.gov.defra.ffc.pay.payment.processed': 10,
    'uk.gov.defra.ffc.pay.payment.submitted': 11,
    'uk.gov.defra.ffc.pay.payment.acknowledged': 12,
    'uk.gov.defra.ffc.pay.payment.settled': 13
  }
  return eventOrder[event.type]
}

module.exports = {
  getEventOrder
}
