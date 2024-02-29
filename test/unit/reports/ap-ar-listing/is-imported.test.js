const { isImported } = require('../../../../app/reports/ap-ar-listing/is-imported')
const ackEvent = require('../../../mocks/events/acknowledged')
const settledEvent = require('../../../mocks/events/settled')
const processedEvent = require('../../../mocks/events/processed')
let events

describe('isImported', () => {
  beforeEach(() => {
    events = []
  })

  test('should return Y for acknowledged event', () => {
    events = [ackEvent]
    const value = isImported(events)
    expect(value).toEqual('Y')
  })

  test('should return Y for settled event', () => {
    events = [settledEvent]
    const value = isImported(events)
    expect(value).toEqual('Y')
  })

  test('should return null for any other event type', () => {
    events = [processedEvent]
    const value = isImported(events)
    expect(value).toEqual(null)
  })
})
