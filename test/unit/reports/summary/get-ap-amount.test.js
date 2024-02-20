const extractedEvent = require('../../../mocks/events/extracted')
const processedEvent = require('../../../mocks/events/processed')

const { getAPAmount } = require('../../../../app/reports/summary/get-ap-amount')

let events
const ev1 = JSON.parse(JSON.stringify(processedEvent))
ev1.data.ledger = 'AP'
ev1.data.value = -30000

const ev2 = JSON.parse(JSON.stringify(processedEvent))
ev2.data.ledger = 'AP'
ev2.data.value = -40000

const ev3 = JSON.parse(JSON.stringify(processedEvent))
ev3.data.ledger = 'AR'
ev3.data.value = 10000

describe('get AP amount', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    events = [extractedEvent, ev1]
  })

  test('should return the correct total from the processed event with AP ledger', () => {
    const amount = getAPAmount(events)
    expect(amount).toEqual(ev1.data.value)
  })

  test('should return correct total if multiple processed event with AP ledger', () => {
    events.push(ev2)
    const amount = getAPAmount(events)
    expect(amount).toEqual(ev1.data.value + ev2.data.value)
  })

  test('should ignore processed events with AR ledger', () => {
    events.push(ev3)
    const amount = getAPAmount(events)
    expect(amount).toEqual(ev1.data.value)
  })

  test('should return null if no events', () => {
    const amount = getAPAmount([])
    expect(amount).toEqual(null)
  })
})
