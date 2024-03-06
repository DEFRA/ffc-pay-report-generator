const { getSettledValue } = require('../../../../app/reports/ap-ar-listing/get-settled-value')

const extractedEvent = require('../../../mocks/events/extracted')
const settledEvent = require('../../../mocks/events/settled')

let events

describe('get settledvalue', () => {
  beforeEach(() => {
    events = []
  })

  test('should return settled value if settled event exist', () => {
    events = [settledEvent]
    const value = getSettledValue(events)
    expect(value).toEqual(settledEvent.data.settledValue)
  })

  test('should return null if different event', () => {
    events = [extractedEvent]
    const value = getSettledValue(events)
    expect(value).toEqual(null)
  })

  test('should return null if no event', () => {
    const value = getSettledValue(events)
    expect(value).toEqual(null)
  })
})
