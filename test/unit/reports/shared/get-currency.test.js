const { UNKNOWN } = require('../../../../app/constants/unknown')

const extractedEvent = require('../../../mocks/events/extracted')
const enrichedEvent = require('../../../mocks/events/enriched')

const { getCurrency } = require('../../../../app/reports/shared/get-currency')

const events = [extractedEvent, enrichedEvent]

describe('get currency', () => {
  test('should return the currency from the enriched event', () => {
    const currency = getCurrency(events)
    expect(currency).toEqual(enrichedEvent.data.currency)
  })

  test('should return unknown if no enriched event is found', () => {
    const currency = getCurrency([extractedEvent])
    expect(currency).toEqual(UNKNOWN)
  })

  test('should return unknown if no events', () => {
    const currency = getCurrency([])
    expect(currency).toEqual(UNKNOWN)
  })
})
