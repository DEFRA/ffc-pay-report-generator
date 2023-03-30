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
} = require('../../../app/constants/events')

const { getEventOrder } = require('../../../app/reports/mi-report/get-event-order')

describe('get event order', () => {
  test('should return 1 for payment extracted event', () => {
    const eventOrder = getEventOrder(PAYMENT_EXTRACTED)
    expect(eventOrder).toEqual(1)
  })

  test('should return 2 for payment enriched event', () => {
    const eventOrder = getEventOrder(PAYMENT_ENRICHED)
    expect(eventOrder).toEqual(2)
  })

  test('should return 3 for payment paused for debt data event', () => {
    const eventOrder = getEventOrder(PAYMENT_PAUSED_DEBT)
    expect(eventOrder).toEqual(3)
  })

  test('should return 4 for payment debt data attached event', () => {
    const eventOrder = getEventOrder(PAYMENT_DEBT_ATTACHED)
    expect(eventOrder).toEqual(4)
  })

  test('should return 5 for payment paused for ledger assignment event', () => {
    const eventOrder = getEventOrder(PAYMENT_PAUSED_LEDGER)
    expect(eventOrder).toEqual(5)
  })

  test('should return 6 for payment ledger assigned event', () => {
    const eventOrder = getEventOrder(PAYMENT_LEDGER_ASSIGNED)
    expect(eventOrder).toEqual(6)
  })

  test('should return 7 for payment paused for quality check event', () => {
    const eventOrder = getEventOrder(PAYMENT_PAUSED_QUALITY_CHECK)
    expect(eventOrder).toEqual(7)
  })

  test('should return 8 for payment failed quality check event', () => {
    const eventOrder = getEventOrder(PAYMENT_FAILED_QUALITY_CHECK)
    expect(eventOrder).toEqual(8)
  })

  test('should return 9 for payment passed quality check event', () => {
    const eventOrder = getEventOrder(PAYMENT_PASSED_QUALITY_CHECK)
    expect(eventOrder).toEqual(9)
  })

  test('should return 10 for payment processed event', () => {
    const eventOrder = getEventOrder(PAYMENT_PROCESSED)
    expect(eventOrder).toEqual(10)
  })

  test('should return 11 for payment submitted event', () => {
    const eventOrder = getEventOrder(PAYMENT_SUBMITTED)
    expect(eventOrder).toEqual(11)
  })

  test('should return 12 for payment acknowledged event', () => {
    const eventOrder = getEventOrder(PAYMENT_ACKNOWLEDGED)
    expect(eventOrder).toEqual(12)
  })

  test('should return 13 for payment settled event', () => {
    const eventOrder = getEventOrder(PAYMENT_SETTLED)
    expect(eventOrder).toEqual(13)
  })
})
