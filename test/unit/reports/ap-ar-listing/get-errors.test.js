jest.mock('../../../../app/storage')

jest.mock('../../../../app/reports/ap-ar-listing/get-warnings')
const { getWarnings: mockGetWarnings } = require('../../../../app/reports/ap-ar-listing/get-warnings')

jest.mock('../../../../app/reports/shared/get-frn')
const { getFrn: mockGetFrn } = require('../../../../app/reports/shared/get-frn')

jest.mock('../../../../app/reports/ap-ar-listing/get-filename')
const { getFilename: mockGetFilename } = require('../../../../app/reports/ap-ar-listing/get-filename')

const { getErrors } = require('../../../../app/reports/ap-ar-listing/get-errors')

const settledEvent = require('../../../mocks/events/settled')
const acknowledgedEvent = require('../../../mocks/events/acknowledged')
const { CORRELATION_ID } = require('../../../mocks/values/correlation-id')
const warning = require('../../../mocks/events/warning')
const { FRN } = require('../../../mocks/values/frn')
const { PAYMENT_DAX_REJECTED, PAYMENT_INVALID_BANK } = require('../../../../app/constants/warnings')
const { FILENAME } = require('../../../mocks/values/filename')

let events

describe('get errors', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetWarnings.mockReturnValue([warning])
    mockGetFrn.mockReturnValue(FRN)
    mockGetFilename.mockReturnValue(FILENAME)
    events = []
  })

  test('should return undefined phError if settled event', async () => {
    events = [settledEvent]
    const value = await getErrors(events, CORRELATION_ID)
    expect(value.phError).toBe(undefined)
  })

  test('should return undefined daxError if settled event', async () => {
    events = [settledEvent]
    const value = await getErrors(events, CORRELATION_ID)
    expect(value.daxError).toBe(undefined)
  })

  test('should call get FRN if no settled event', async () => {
    await getErrors(events, CORRELATION_ID)
    expect(mockGetFrn).toHaveBeenCalledWith(events)
  })

  test('should not call get FRN if settled event', async () => {
    events = [settledEvent]
    await getErrors(events, CORRELATION_ID)
    expect(mockGetFrn).not.toHaveBeenCalled()
  })

  test('should call get filename if no settled event', async () => {
    await getErrors(events, CORRELATION_ID)
    expect(mockGetFilename).toHaveBeenCalledWith(events)
  })

  test('should not call get filename if settled event', async () => {
    events = [settledEvent]
    await getErrors(events, CORRELATION_ID)
    expect(mockGetFilename).not.toHaveBeenCalled()
  })

  test('should call getWarning if no settled event', async () => {
    await getErrors(events, CORRELATION_ID)
    expect(mockGetWarnings).toHaveBeenCalled()
  })

  test('should call getWarning with filter if acknowledgedEvent', async () => {
    events = [acknowledgedEvent]
    await getErrors(events, CORRELATION_ID)
    expect(mockGetWarnings).toHaveBeenCalledWith(events, acknowledgedEvent)
  })

  test('should call getWarning with undefined ackEvent if no acknowledgedEvent', async () => {
    await getErrors(events, CORRELATION_ID)
    expect(mockGetWarnings).toHaveBeenCalledWith(events, undefined)
  })

  test('should not call getWarning if settled event', async () => {
    events = [settledEvent]
    await getErrors(events, CORRELATION_ID)
    expect(mockGetWarnings).not.toHaveBeenCalled()
  })

  test('should provide null phError if warnings is empty array', async () => {
    mockGetWarnings.mockReturnValue([])
    const value = await getErrors(events, CORRELATION_ID)
    expect(value.phError).toBe(undefined)
  })

  test('should provide null daxError if warnings is empty array', async () => {
    mockGetWarnings.mockReturnValue([])
    const value = await getErrors(events, CORRELATION_ID)
    expect(value.daxError).toBe(undefined)
  })

  test('should provide undefined phError if warnings contains PAYMENT_DAX_REJECTED type error with right correlationId', async () => {
    mockGetWarnings.mockReturnValue([{ type: PAYMENT_DAX_REJECTED, data: { correlationId: CORRELATION_ID, message: 'An error' } }])
    const value = await getErrors(events, CORRELATION_ID)
    expect(value.phError).toBe(undefined)
  })

  test('should provide daxError if warnings contains PAYMENT_DAX_REJECTED type error with right correlationId', async () => {
    mockGetWarnings.mockReturnValue([{ type: PAYMENT_DAX_REJECTED, data: { correlationId: CORRELATION_ID, message: 'An error' } }])
    const value = await getErrors(events, CORRELATION_ID)
    expect(value.daxError).toBe('An error')
  })

  test('should provide undefined phError if warnings contains PAYMENT_DAX_REJECTED type error with right frn', async () => {
    mockGetWarnings.mockReturnValue([{ type: PAYMENT_DAX_REJECTED, data: { frn: FRN, message: 'An error' } }])
    const value = await getErrors(events, CORRELATION_ID)
    expect(value.phError).toBe(undefined)
  })

  test('should provide daxError if warnings contains PAYMENT_DAX_REJECTED type error with right frn', async () => {
    mockGetWarnings.mockReturnValue([{ type: PAYMENT_DAX_REJECTED, data: { frn: FRN, message: 'An error' } }])
    const value = await getErrors(events, CORRELATION_ID)
    expect(value.daxError).toBe('An error')
  })

  test('should provide undefined daxError if warnings contains PAYMENT_DAX_REJECTED type error with no frn or correlationId match', async () => {
    mockGetWarnings.mockReturnValue([{ type: PAYMENT_DAX_REJECTED, data: { message: 'An error' } }])
    const value = await getErrors(events, CORRELATION_ID)
    expect(value.daxError).toBe(undefined)
  })

  test('should provide undefined phError if warnings contains PAYMENT_INVALID_BANK type error with right correlationId', async () => {
    mockGetWarnings.mockReturnValue([{ type: PAYMENT_INVALID_BANK, data: { correlationId: CORRELATION_ID, message: 'An error' } }])
    const value = await getErrors(events, CORRELATION_ID)
    expect(value.phError).toBe(undefined)
  })

  test('should provide daxError if warnings contains PAYMENT_INVALID_BANK type error with right correlationId', async () => {
    mockGetWarnings.mockReturnValue([{ type: PAYMENT_INVALID_BANK, data: { correlationId: CORRELATION_ID, message: 'An error' } }])
    const value = await getErrors(events, CORRELATION_ID)
    expect(value.daxError).toBe('An error')
  })

  test('should provide undefined phError if warnings contains PAYMENT_INVALID_BANK type error with right frn', async () => {
    mockGetWarnings.mockReturnValue([{ type: PAYMENT_INVALID_BANK, data: { frn: FRN, message: 'An error' } }])
    const value = await getErrors(events, CORRELATION_ID)
    expect(value.phError).toBe(undefined)
  })

  test('should provide daxError if warnings contains PAYMENT_INVALID_BANK type error with right frn', async () => {
    mockGetWarnings.mockReturnValue([{ type: PAYMENT_INVALID_BANK, data: { frn: FRN, message: 'An error' } }])
    const value = await getErrors(events, CORRELATION_ID)
    expect(value.daxError).toBe('An error')
  })

  test('should provide undefined daxError if warnings contains PAYMENT_INVALID_BANK type error with no correlationId or frn match', async () => {
    mockGetWarnings.mockReturnValue([{ type: PAYMENT_INVALID_BANK, data: { message: 'An error' } }])
    const value = await getErrors(events, CORRELATION_ID)
    expect(value.daxError).toBe(undefined)
  })

  test('should provide phError if warnings contains neither PAYMENT_INVALID_BANK nor PAYMENT_DAX_REJECTED type error with right correlationId', async () => {
    mockGetWarnings.mockReturnValue([{ type: 'other_type', data: { correlationId: CORRELATION_ID, message: 'An error' } }])
    const value = await getErrors(events, CORRELATION_ID)
    expect(value.phError).toBe('An error')
  })

  test('should not provide phError if acknowledgedEvent', async () => {
    events = [acknowledgedEvent]
    mockGetWarnings.mockReturnValue([{ type: 'other_type', data: { correlationId: CORRELATION_ID, message: 'An error' } }])
    const value = await getErrors(events, CORRELATION_ID)
    expect(value.phError).toBe(undefined)
  })

  test('should provide undefined daxError if warnings contains neither PAYMENT_INVALID_BANK nor PAYMENT_DAX_REJECTED type error with right correlationId', async () => {
    mockGetWarnings.mockReturnValue([{ type: 'other_type', data: { frn: FRN, message: 'An error' } }])
    const value = await getErrors(events, CORRELATION_ID)
    expect(value.daxError).toBe(undefined)
  })

  test('should provide phError if warnings contains neither PAYMENT_INVALID_BANK nor PAYMENT_DAX_REJECTED type error with right subject', async () => {
    mockGetWarnings.mockReturnValue([{ type: 'other_type', subject: FILENAME, data: { message: 'An error' } }])
    const value = await getErrors(events, CORRELATION_ID)
    expect(value.phError).toBe('An error')
  })

  test('should provide undefined daxError if warnings contains neither PAYMENT_INVALID_BANK nor PAYMENT_DAX_REJECTED type error with right subject', async () => {
    mockGetWarnings.mockReturnValue([{ type: 'other_type', subject: FILENAME, data: { message: 'An error' } }])
    const value = await getErrors(events, CORRELATION_ID)
    expect(value.daxError).toBe(undefined)
  })

  test('should provide undefined phError if no correlationID or subject match', async () => {
    mockGetWarnings.mockReturnValue([{ type: 'other_type', data: { message: 'An error' } }])
    const value = await getErrors(events, CORRELATION_ID)
    expect(value.phError).toBe(undefined)
  })
})
