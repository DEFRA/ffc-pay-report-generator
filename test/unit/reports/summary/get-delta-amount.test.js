const { convertToPence } = require('../../../../app/currency-convert')
const { getDeltaAmount } = require('../../../../app/reports/summary/get-delta-amount')

const extractedEvent = require('../../../mocks/events/extracted')

let events
let fullEvents
const ev1 = JSON.parse(JSON.stringify(extractedEvent))
ev1.data.value = 50000
ev1.data.paymentRequestNumber = 1
const ev2 = JSON.parse(JSON.stringify(extractedEvent))
ev2.data.value = 30000
ev2.data.paymentRequestNumber = 2

describe('get delta amount', () => {
  beforeEach(() => {
    events = []
    fullEvents = []
  })

  test('should return event value', () => {
    events = [ev1]
    fullEvents = [{
      correlationId: 'made-up',
      events: [ev1]
    }]
    const value = getDeltaAmount(events, fullEvents)
    expect(value).toEqual(convertToPence(ev1.data.value))
  })

  test('should return difference between two extracted events if two', () => {
    events = [ev2]
    fullEvents = [{
      correlationId: 'made-up',
      events: [ev2]
    }, {
      correlatationId: 'made-up-2',
      events: [ev1]
    }]
    const value = getDeltaAmount(events, fullEvents)
    expect(value).toEqual(convertToPence(ev2.data.value) - convertToPence(ev1.data.value))
  })

  test('should return null if no events', () => {
    const value = getDeltaAmount(events, fullEvents)
    expect(value).toEqual(null)
  })
})
