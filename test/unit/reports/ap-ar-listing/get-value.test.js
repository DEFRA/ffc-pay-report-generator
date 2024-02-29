const { getValue } = require('../../../../app/reports/ap-ar-listing/get-value')

const extractedEvent = require('../../../mocks/events/extracted')
const enrichedEvent = require('../../../mocks/events/enriched')
const submittedEvent = require('../../../mocks/events/submitted')
const { PAYMENT_ENRICHED, PAYMENT_EXTRACTED } = require('../../../../app/constants/events')

let events

describe('get value', () => {
  beforeEach(() => {
    events = []
  })

  test('should return enriched value if enriched event exist and enriched type provided', () => {
    events = [extractedEvent, enrichedEvent]
    const value = getValue(events, PAYMENT_ENRICHED)
    expect(value).toEqual(enrichedEvent.data.value)
  })

  test('should return extracted value converted to pence if extracted type provided', () => {
    events = [extractedEvent]
    const value = getValue(events, PAYMENT_EXTRACTED)
    expect(value).toEqual(extractedEvent.data.value)
  })

  test('should returnnull if type of event does not exist', () => {
    events = [submittedEvent]
    const value = getValue(events, PAYMENT_EXTRACTED)
    expect(value).toEqual(null)
  })
})
