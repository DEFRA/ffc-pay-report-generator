const extractedEvent = require('../../../mocks/events/extracted')
const enrichedEvent = require('../../../mocks/events/enriched')
const resetEvent = require('../../../mocks/events/reset')
const submittedEvent = require('../../../mocks/events/submitted')

const { PAYMENT_ENRICHED_STATUS, PAYMENT_EXTRACTED_STATUS, PAYMENT_RESET_STATUS, PAYMENT_SUBMITTED_STATUS } = require('../../../../app/constants/statuses')

const { getStatus } = require('../../../../app/reports/mi/get-status')

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

  test('should return reset status if reset last event', () => {
    events = [extractedEvent, enrichedEvent, resetEvent]
    const status = getStatus(events)
    expect(status).toEqual(PAYMENT_RESET_STATUS)
  })

  test('should return submitted status if submitted last event', () => {
    events = [extractedEvent, enrichedEvent, resetEvent, submittedEvent]
    const status = getStatus(events)
    expect(status).toEqual(PAYMENT_SUBMITTED_STATUS)
  })
})
