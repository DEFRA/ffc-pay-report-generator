const submittedEvent = require('../../../mocks/events/submitted')
const acknowledgedEvent = require('../../../mocks/events/acknowledged')
const settledEvent = require('../../../mocks/events/settled')
const { splitAPAREvents } = require('../../../../app/reports/ap-ar-listing/split-ap-ar-events')
const { CORRELATION_ID } = require('../../../mocks/values/correlation-id')

let events

describe('split AP and AR events', () => {
  beforeEach(() => {
    events = []
  })

  test('should return only AP events if no AR', () => {
    events = [{
      correlationId: CORRELATION_ID,
      events: [submittedEvent, acknowledgedEvent, settledEvent]
    }]
    const { apEvents, arEvents } = splitAPAREvents(events)
    expect(apEvents).toEqual(events)
    expect(arEvents).toEqual([])
  })

  test('should return both AP & AR events if AR', () => {
    const submittedAREvent = JSON.parse(JSON.stringify(submittedEvent))
    submittedAREvent.data.ledger = 'AR'
    events = [{
      correlationId: CORRELATION_ID,
      events: [submittedEvent, submittedAREvent, acknowledgedEvent, settledEvent]
    }]
    const { apEvents, arEvents } = splitAPAREvents(events)
    expect(apEvents).toEqual([{
      correlationId: CORRELATION_ID,
      events: [submittedEvent, acknowledgedEvent, settledEvent]
    }])
    expect(arEvents).toEqual([{
      correlationId: CORRELATION_ID,
      events: [submittedAREvent]
    }])
  })
})
