const { getRevenue } = require('../../../../app/reports/summary/get-revenue')

const processedEvent = require('../../../mocks/events/processed')
const { DATE } = require('../../../mocks/values/date')
const { CAPITAL, REVENUE } = require('../../../mocks/values/revenue')

let events
const ev1 = JSON.parse(JSON.stringify(processedEvent))
ev1.data.schemeId = 5
ev1.data.dueDate = DATE
const ev2 = JSON.parse(JSON.stringify(processedEvent))
ev2.data.schemeId = 5
ev2.data.dueDate = '01/12/2024'
const ev3 = JSON.parse(JSON.stringify(processedEvent))
ev3.data.schemeId = 5
ev3.data.dueDate = '01/01/2016'
const ev4 = JSON.parse(JSON.stringify(processedEvent))
ev4.data.schemeId = 6

describe('get revenue', () => {
  beforeEach(() => {
    events = []
  })

  test('should return capital if scheme is CS, date not 01/12 or 01/01/2016', () => {
    events = [ev1]
    const value = getRevenue(events)
    expect(value).toEqual(CAPITAL)
  })

  test('should return revenue if scheme is CS, date 01/12', () => {
    events = [ev2]
    const value = getRevenue(events)
    expect(value).toEqual(REVENUE)
  })

  test('should return revenue if scheme is CS, date 01/01/2016', () => {
    events = [ev3]
    const value = getRevenue(events)
    expect(value).toEqual(REVENUE)
  })

  test('should return null if scheme is not CS', () => {
    events = [ev4]
    const value = getRevenue(events)
    expect(value).toEqual(null)
  })
})
