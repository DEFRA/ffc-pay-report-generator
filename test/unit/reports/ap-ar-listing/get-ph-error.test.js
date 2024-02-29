jest.mock('../../../../app/reports/ap-listing/get-warning')
const { getWarning: mockGetWarning } = require('../../../../app/reports/ap-ar-listing/get-warnings')

const { getPHError } = require('../../../../app/reports/ap-ar-listing/get-ph-error')

const ackEvent = require('../../../mocks/events/acknowledged')
const settledEvent = require('../../../mocks/events/settled')
const { CORRELATION_ID } = require('../../../mocks/values/correlation-id')
const warning = require('../../../mocks/events/warning')
const { FRN } = require('../../../mocks/values/frn')

let events

describe('get PH error', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetWarning.mockReturnValue(warning)
    events = []
  })

  test('should return null if acknowledged event', async () => {
    events = [ackEvent]
    const value = await getPHError(events, CORRELATION_ID)
    expect(value).toEqual(null)
  })

  test('should return null if settled event', async () => {
    events = [settledEvent]
    const value = await getPHError(events, CORRELATION_ID)
    expect(value).toEqual(null)
  })

  test('should call getWarning if neither event', async () => {
    await getPHError(events, CORRELATION_ID)
    expect(mockGetWarning).toHaveBeenCalled()
  })

  test('should return warning message', async () => {
    const value = await getPHError(events, CORRELATION_ID)
    expect(value).toEqual(warning.data.message)
  })

  test('should return null if warning has no message', async () => {
    mockGetWarning.mockReturnValue({ data: { frn: FRN } })
    const value = await getPHError(events, CORRELATION_ID)
    expect(value).toEqual(null)
  })

  test('should return null if no warning', async () => {
    mockGetWarning.mockReturnValue(null)
    const value = await getPHError(events, CORRELATION_ID)
    expect(value).toEqual(null)
  })
})
