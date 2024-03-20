const { splitAPAREvents } = require('../../../../app/reports/ap-ar-listing/split-ap-ar-events')
const { PAYMENT_SUBMITTED, PAYMENT_ACKNOWLEDGED } = require('../../../../app/constants/events')

describe('splitAPAREvents', () => {
  test('should split events into AP and AR events', () => {
    const events = [
      {
        events: [
          { type: PAYMENT_SUBMITTED, data: { ledger: 'AP', invoiceNumber: 'A' } },
          { type: PAYMENT_SUBMITTED, data: { ledger: 'AP', invoiceNumber: 'B' } },
          { type: PAYMENT_ACKNOWLEDGED, data: { ledger: 'AR' } }
        ]
      }
    ]

    const { apEvents, arEvents } = splitAPAREvents(events)

    expect(apEvents).toHaveLength(2)
    expect(arEvents).toHaveLength(1)

    expect(apEvents[0].events).toHaveLength(1)
    expect(apEvents[0].events[0].type).toBe(PAYMENT_SUBMITTED)
    expect(apEvents[0].events[0].data.ledger).toBe('AP')
    expect(apEvents[0].events[0].data.invoiceNumber).toBe('A')

    expect(apEvents[1].events).toHaveLength(1)
    expect(apEvents[1].events[0].type).toBe(PAYMENT_SUBMITTED)
    expect(apEvents[1].events[0].data.ledger).toBe('AP')
    expect(apEvents[1].events[0].data.invoiceNumber).toBe('B')

    expect(arEvents[0].events).toHaveLength(1)
    expect(arEvents[0].events[0].type).toBe(PAYMENT_ACKNOWLEDGED)
    expect(arEvents[0].events[0].data.ledger).toBe('AR')
  })
})
