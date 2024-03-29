const { VALUE } = require('../../../mocks/values/value')

const { getValue } = require('../../../../app/reports/mi/get-value')

const extractedEvent = require('../../../mocks/events/extracted')
const enrichedEvent = require('../../../mocks/events/enriched')
const submittedEvent = require('../../../mocks/events/submitted')

let events

describe('get value', () => {
  beforeEach(() => {
    events = []
  })

  test('should return enriched value if enriched event exist', () => {
    events = [extractedEvent, enrichedEvent]
    const value = getValue(events)
    expect(value).toEqual(enrichedEvent.data.value)
  })

  test('should return extracted value converted to pence if enriched event does not exist', () => {
    events = [extractedEvent]
    const value = getValue(events)
    expect(value).toEqual(VALUE)
  })

  test('should return last event value if neither enriched nor extracted event exist', () => {
    events = [submittedEvent]
    const value = getValue(events)
    expect(value).toEqual(submittedEvent.data.value)
  })
})
