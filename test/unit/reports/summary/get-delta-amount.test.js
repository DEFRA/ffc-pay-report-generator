const { getDeltaAmount } = require('../../../../app/reports/summary/get-delta-amount')

const processedEvent = require('../../../mocks/events/processed')
const submittedEvent = require('../../../mocks/events/submitted')

let events
const ev1 = JSON.parse(JSON.stringify(processedEvent))
ev1.data.value = 50000
const ev2 = JSON.parse(JSON.stringify(processedEvent))
ev2.data.debtType = -30000
const ev3 = JSON.parse(JSON.stringify(submittedEvent))
ev3.data.debtType = 15000

describe('get delta amount', () => {
  beforeEach(() => {
    events = []
  })

  test('should return processed event value', () => {
    events = [ev1]
    const value = getDeltaAmount(events)
    expect(value).toEqual(ev1.data.value)
  })

  test('should return sum of processed event value', () => {
    events = [ev1, ev2]
    const value = getDeltaAmount(events)
    expect(value).toEqual(ev1.data.value + ev2.data.value)
  })

  test('should return null if no extractedEvent', () => {
    events = [ev3]
    const value = getDeltaAmount(events)
    expect(value).toEqual(null)
  })

  test('should return null if no events', () => {
    const value = getDeltaAmount(events)
    expect(value).toEqual(null)
  })
})
