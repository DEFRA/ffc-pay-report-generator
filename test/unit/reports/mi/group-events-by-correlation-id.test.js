const { CORRELATION_ID } = require('../../../mocks/values/correlation-id')

const { groupEventsByCorrelationId } = require('../../../../app/reports/mi/group-events-by-correlation-id')

const extractedEvent = require('../../../mocks/events/extracted')
const enrichedEvent = require('../../../mocks/events/enriched')

let events

describe('group events by correlation id', () => {
  beforeEach(() => {
    extractedEvent.partitionKey = CORRELATION_ID
    enrichedEvent.partitionKey = CORRELATION_ID
    events = []
  })

  test('should return empty array if no events', () => {
    const result = groupEventsByCorrelationId(events)
    expect(result).toEqual([])
  })

  test('should return array grouped by correlation id', () => {
    events = [extractedEvent, enrichedEvent]
    const result = groupEventsByCorrelationId(events)
    expect(result[0].correlationId).toEqual(CORRELATION_ID)
  })

  test('should include all events for correlation id', () => {
    events = [extractedEvent, enrichedEvent]
    const result = groupEventsByCorrelationId(events)
    expect(result[0].events.length).toEqual(2)
  })
})
