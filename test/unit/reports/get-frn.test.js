const extractedEvent = require('../../mocks/events/extracted')
const enrichedEvent = require('../../mocks/events/enriched')

const { UNKNOWN } = require('../../../app/constants/unknown')

const { getFrn } = require('../../../app/reports/mi-report/get-frn')

const events = [extractedEvent, enrichedEvent]

describe('get frn', () => {
  test('should return the frn from the enriched event', () => {
    const frn = getFrn(events)
    expect(frn).toEqual(enrichedEvent.data.frn)
  })

  test('should return first event frn if no enriched event is found', () => {
    const frn = getFrn([extractedEvent])
    expect(frn).toEqual(extractedEvent.data.frn)
  })

  test('should return unknown if no events', () => {
    const frn = getFrn([])
    expect(frn).toEqual(UNKNOWN)
  })
})
