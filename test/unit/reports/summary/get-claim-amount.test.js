const { convertToPence } = require('../../../../app/currency-convert')
const { getClaimAmount } = require('../../../../app/reports/summary/get-claim-amount')

const extractedEvent = require('../../../mocks/events/extracted')
const submittedEvent = require('../../../mocks/events/submitted')

let events

describe('get claim amount', () => {
  beforeEach(() => {
    events = []
  })

  test('should return extracted event value converted to pence', () => {
    events = [extractedEvent]
    const value = getClaimAmount(events)
    expect(value).toEqual(convertToPence(extractedEvent.data.value))
  })

  test('should return null if no extractedEvent', () => {
    events = [submittedEvent]
    const value = getClaimAmount(events)
    expect(value).toEqual(null)
  })

  test('should return null if no events', () => {
    const value = getClaimAmount(events)
    expect(value).toEqual(null)
  })
})
