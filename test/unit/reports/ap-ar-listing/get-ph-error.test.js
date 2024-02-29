jest.mock('../../../../app/reports/ap-ar-listing/get-filename')
const { getFilename: mockGetFilename } = require('../../../../app/reports/ap-ar-listing/get-filename')

jest.mock('../../../../app/reports/ap-ar-listing/get-warnings')
const { getWarnings: mockGetWarnings } = require('../../../../app/reports/ap-ar-listing/get-warnings')

const { getPHError } = require('../../../../app/reports/ap-ar-listing/get-ph-error')

const ackEvent = require('../../../mocks/events/acknowledged')
const settledEvent = require('../../../mocks/events/settled')
const { CORRELATION_ID } = require('../../../mocks/values/correlation-id')
const warning = require('../../../mocks/events/warning')
const { FRN } = require('../../../mocks/values/frn')
const { FILENAME } = require('../../../mocks/values/filename')

let events

describe('get PH error', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetFilename.mockReturnValue(FILENAME)
    mockGetWarnings.mockReturnValue([warning])
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

  test('should call getFilename if neither event', async () => {
    await getPHError(events, CORRELATION_ID)
    expect(mockGetFilename).toHaveBeenCalledWith(events)
  })

  test('should call getWarning if neither event', async () => {
    await getPHError(events, CORRELATION_ID)
    expect(mockGetWarnings).toHaveBeenCalled()
  })

  test('should return warning message', async () => {
    const value = await getPHError(events, CORRELATION_ID)
    expect(value).toEqual(warning.data.message)
  })

  test('should return warning message if subject matches filename', async () => {
    mockGetWarnings.mockReturnValue([{ subject: FILENAME, data: { frn: FRN, message: warning.data.message } }])
    const value = await getPHError(events, CORRELATION_ID)
    expect(value).toEqual(warning.data.message)
  })

  test('should return null if warning has no correlationId or subject', async () => {
    mockGetWarnings.mockReturnValue([{ data: { frn: FRN } }])
    const value = await getPHError(events, CORRELATION_ID)
    expect(value).toEqual(null)
  })

  test('should return null if warning has different subject, no correlationId', async () => {
    mockGetWarnings.mockReturnValue([{ subject: 'random', data: { frn: FRN } }])
    const value = await getPHError(events, CORRELATION_ID)
    expect(value).toEqual(null)
  })

  test('should return null if warning has different correlationId, no subject', async () => {
    mockGetWarnings.mockReturnValue([{ data: { correlationId: 'random', frn: FRN } }])
    const value = await getPHError(events, CORRELATION_ID)
    expect(value).toEqual(null)
  })

  test('should return null if no message, subject match', async () => {
    mockGetWarnings.mockReturnValue([{ subject: FILENAME, data: { frn: FRN } }])
    const value = await getPHError(events, CORRELATION_ID)
    expect(value).toEqual(null)
  })

  test('should return null if no message, corrId match', async () => {
    mockGetWarnings.mockReturnValue([{ data: { correlationId: CORRELATION_ID, frn: FRN } }])
    const value = await getPHError(events, CORRELATION_ID)
    expect(value).toEqual(null)
  })

  test('should return null if no warning', async () => {
    mockGetWarnings.mockReturnValue(null)
    const value = await getPHError(events, CORRELATION_ID)
    expect(value).toEqual(null)
  })
})
