const { getYear } = require('../../../../app/reports/summary/get-year')

const processedEvent = require('../../../mocks/events/processed')
const { DATE } = require('../../../mocks/values/date')

let events
const ev1 = JSON.parse(JSON.stringify(processedEvent))
ev1.data.schemeId = 5
ev1.data.dueDate = DATE
const ev2 = JSON.parse(JSON.stringify(processedEvent))
ev2.data.schemeId = 6

describe('get year', () => {
  beforeEach(() => {
    events = []
  })

  test('should return marketing year if schemeId != 5', () => {
    events = [ev2]
    const value = getYear(events)
    expect(value).toEqual(ev2.data.marketingYear)
  })

  test('should return due date year is schemeId = 5', () => {
    events = [ev1]
    const value = getYear(events)
    expect(value).toEqual(new Date(DATE).getFullYear())
  })
})
