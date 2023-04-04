const { PAYMENT_ENRICHED_STATUS, PAYMENT_EXTRACTED_STATUS } = require('../../../app/constants/statuses')

const { getStatus } = require('../../../app/reports/mi-report/get-status')

const extractedEvent = require('../../mocks/events/extracted')
const enrichedEvent = require('../../mocks/events/enriched')

let events

describe('get status', () => {
  beforeEach(() => {
    events = []
  })

  test('should return extracted status if extracted last event', () => {
    events = [extractedEvent]
    const status = getStatus(events)
    expect(status).toEqual(PAYMENT_EXTRACTED_STATUS)
  })

  test('should return enriched status if enriched last event', () => {
    events = [extractedEvent, enrichedEvent]
    const status = getStatus(events)
    expect(status).toEqual(PAYMENT_ENRICHED_STATUS)
  })
})
