jest.mock('../../../../app/reports/summary/get-revenue')
const { getRevenue: mockGetRevenue } = require('../../../../app/reports/summary/get-revenue')

const { getYear } = require('../../../../app/reports/summary/get-year')

const processedEvent = require('../../../mocks/events/processed')
const { DATE } = require('../../../mocks/values/date')
const { REVENUE, CAPITAL } = require('../../../mocks/values/revenue')

let events

describe('get year', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    events = []
    mockGetRevenue.mockReturnValue(REVENUE)
  })

  test('should return marketing year if schemeId != 5', () => {
    const ev = JSON.parse(JSON.stringify(processedEvent))
    ev.data.schemeId = 6
    events = [ev]
    const value = getYear(events)
    expect(value).toEqual(ev.data.marketingYear)
  })

  test('should return marketing year if schemeId = 5, getRevenue = CAPITAL', () => {
    const ev = JSON.parse(JSON.stringify(processedEvent))
    ev.data.schemeId = 5
    mockGetRevenue.mockReturnValue(CAPITAL)
    events = [ev]
    const value = getYear(events)
    expect(value).toEqual(ev.data.marketingYear)
  })

  test('should return due date year is schemeId = 5, getRevenue = Revenue', () => {
    const ev = JSON.parse(JSON.stringify(processedEvent))
    ev.data.schemeId = 5
    ev.data.dueDate = DATE
    events = [ev]
    const value = getYear(events)
    expect(value).toEqual(new Date(DATE).getFullYear())
  })
})
