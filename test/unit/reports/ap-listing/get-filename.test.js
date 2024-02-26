const submittedEvent = require('../../../mocks/events/submitted')
const acknowledgedEvent = require('../../../mocks/events/acknowledged')
const settledEvent = require('../../../mocks/events/settled')
const { getFilename } = require('../../../../app/reports/ap-listing/get-filename')

let events

describe('get file name', () => {
  beforeEach(() => {
    events = []
  })

  test('should return submitted event subject if a submittedEvent', () => {
    events = [submittedEvent]
    const value = getFilename(events)
    expect(value).toEqual(submittedEvent.subject)
  })

  test('should return batch value if acknowledgedEvent', () => {
    events = [acknowledgedEvent]
    const value = getFilename(events)
    expect(value).toEqual(acknowledgedEvent.data.batch)
  })

  test('should return batch value if settledEvent', () => {
    events = [settledEvent]
    const value = getFilename(events)
    expect(value).toEqual(settledEvent.data.batch)
  })

  test('should return null for none of above events', () => {
    const value = getFilename(events)
    expect(value).toEqual(null)
  })
})
