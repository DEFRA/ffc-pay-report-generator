jest.mock('../../../../app/reports/ap-listing/get-warning')
const { getWarning: mockGetWarning } = require('../../../../app/reports/ap-listing/get-warning')

jest.mock('../../../../app/reports/shared/get-frn')
const { getFrn: mockGetFrn } = require('../../../../app/reports/shared/get-frn')

const { getDaxError } = require('../../../../app/reports/ap-listing/get-dax-error')

const settledEvent = require('../../../mocks/events/settled')
const { CORRELATION_ID } = require('../../../mocks/values/correlation-id')
const warning = require('../../../mocks/events/warning')
const { FRN } = require('../../../mocks/values/frn')

let events

describe('get DAX error', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetWarning.mockReturnValue(warning)
    events = []
  })

  test('should return null if settled event', async () => {
    events = [settledEvent]
    const value = await getDaxError(events, CORRELATION_ID)
    expect(value).toEqual(null)
  })

  test('should call getWarning if no settled event', async () => {
    await getDaxError(events, CORRELATION_ID)
    expect(mockGetWarning).toHaveBeenCalled()
  })

  test('should return warning message', async () => {
    const value = await getDaxError(events, CORRELATION_ID)
    expect(value).toEqual(warning.data.message)
  })

  test('should return null if warning has no message', async () => {
    mockGetWarning.mockReturnValue({ data: { frn: FRN } })
    const value = await getDaxError(events, CORRELATION_ID)
    expect(value).toEqual(null)
  })

  test('should call get FRN if no warning returns', async () => {
    mockGetWarning.mockReturnValue(null)
    await getDaxError(events, CORRELATION_ID)
    expect(mockGetFrn).toHaveBeenCalledWith(events)
  })

  test('should return null if no warnings return', async () => {
    mockGetWarning.mockReturnValue(null)
    const value = await getDaxError(events, CORRELATION_ID)
    expect(value).toEqual(null)
  })
})
