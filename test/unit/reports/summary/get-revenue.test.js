const { getRevenue } = require('../../../../app/reports/summary/get-revenue')

const processedEvent = require('../../../mocks/events/processed')
const extractedEvent = require('../../../mocks/events/extracted')
const { DATE } = require('../../../mocks/values/date')
const { CAPITAL, REVENUE } = require('../../../mocks/values/revenue')

let events

describe('get revenue', () => {
  beforeEach(() => {
    events = []
  })

  test('should return capital if scheme is CS, date not 01/12 or 01/01/2016', () => {
    const ev = JSON.parse(JSON.stringify(processedEvent))
    ev.data.schemeId = 5
    ev.data.dueDate = DATE
    events = [ev]
    const value = getRevenue(events)
    expect(value).toEqual(CAPITAL)
  })

  test('should return revenue if scheme is CS, date 01/12', () => {
    const ev = JSON.parse(JSON.stringify(processedEvent))
    ev.data.schemeId = 5
    ev.data.dueDate = '01/12/2024'
    events = [ev]
    const value = getRevenue(events)
    expect(value).toEqual(REVENUE)
  })

  test('should return revenue if scheme is CS, date 01/01/2016', () => {
    const ev = JSON.parse(JSON.stringify(processedEvent))
    ev.data.schemeId = 5
    ev.data.dueDate = '01/01/2016'
    events = [ev]
    const value = getRevenue(events)
    expect(value).toEqual(REVENUE)
  })

  test('should return null if scheme is not CS', () => {
    const ev = JSON.parse(JSON.stringify(processedEvent))
    ev.data.schemeId = 6
    events = [ev]
    const value = getRevenue(events)
    expect(value).toEqual(null)
  })

  test('should return revenue if scheme is CS, date format YYYY-12-01', () => {
    const ev = JSON.parse(JSON.stringify(extractedEvent))
    ev.data.schemeId = 5
    ev.data.dueDate = '2023-12-01'
    events = [ev]
    const value = getRevenue(events)
    expect(value).toEqual(REVENUE)
  })

  test('should return revenue if scheme is CS, date format 2016-01-01', () => {
    const ev = JSON.parse(JSON.stringify(extractedEvent))
    ev.data.schemeId = 5
    ev.data.dueDate = '2016-01-01'
    events = [ev]
    const value = getRevenue(events)
    expect(value).toEqual(REVENUE)
  })
})
