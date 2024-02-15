jest.mock('../../../../app/reports/shared/get-events')
const { getEvents: mockGetEvents } = require('../../../../app/reports/shared/get-events')

jest.mock('../../../../app/reports/shared/group-events-by-correlation-id')
const { groupEventsByCorrelationId: mockGroupEventsByCorrelationId } = require('../../../../app/reports/shared/group-events-by-correlation-id')

jest.mock('../../../../app/reports/shared/order-grouped-events')
const { orderGroupedEvents: mockOrderGroupedEvents } = require('../../../../app/reports/shared/order-grouped-events')

jest.mock('../../../../app/reports/summary/get-report-lines')
const { getReportLines: mockGetReportLines } = require('../../../../app/reports/summary/get-report-lines')

jest.mock('../../../../app/reports/convert-to-csv')
const { convertToCSV: mockConvertToCSV } = require('../../../../app/reports/convert-to-csv')

jest.mock('../../../../app/storage')
const { writeFile: mockWriteFile } = require('../../../../app/storage')

const { reportsConfig } = require('../../../../app/config')
const { createSummaryReport } = require('../../../../app/reports/summary/create')

const event = require('../../../mocks/events/event')
const groupedEvent = require('../../../mocks/events/grouped-event')
const reportLine = require('../../../mocks/report-lines/summary')
const csv = require('../../../mocks/csv')

describe('create summary report', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockGetEvents.mockResolvedValue([event])
    mockGroupEventsByCorrelationId.mockReturnValue([groupedEvent])
    mockOrderGroupedEvents.mockReturnValue([groupedEvent])
    mockGetReportLines.mockReturnValue([reportLine])
    mockConvertToCSV.mockReturnValue(csv)
  })

  test('should get all payment events', async () => {
    await createSummaryReport()
    expect(mockGetEvents).toHaveBeenCalledTimes(1)
  })

  test('should group events by correlation id', async () => {
    await createSummaryReport()
    expect(mockGroupEventsByCorrelationId).toHaveBeenCalledWith([event])
  })

  test('should group events by correlation id once', async () => {
    await createSummaryReport()
    expect(mockGroupEventsByCorrelationId).toHaveBeenCalledTimes(1)
  })

  test('should order grouped events', async () => {
    await createSummaryReport()
    expect(mockOrderGroupedEvents).toHaveBeenCalledWith([groupedEvent])
  })

  test('should order grouped events once', async () => {
    await createSummaryReport()
    expect(mockOrderGroupedEvents).toHaveBeenCalledTimes(1)
  })

  test('should get report lines', async () => {
    await createSummaryReport()
    expect(mockGetReportLines).toHaveBeenCalledWith([groupedEvent])
  })

  test('should get report lines once', async () => {
    await createSummaryReport()
    expect(mockGetReportLines).toHaveBeenCalledTimes(1)
  })

  test('should convert report lines to csv if report lines', async () => {
    await createSummaryReport()
    expect(mockConvertToCSV).toHaveBeenCalledWith([reportLine])
  })

  test('should convert report lines to csv once if report lines', async () => {
    await createSummaryReport()
    expect(mockConvertToCSV).toHaveBeenCalledTimes(1)
  })

  test('should not convert report lines to csv if no report lines', async () => {
    mockGetReportLines.mockReturnValue([])
    await createSummaryReport()
    expect(mockConvertToCSV).not.toHaveBeenCalled()
  })

  test('should write csv to summary report file if report lines', async () => {
    await createSummaryReport()
    expect(mockWriteFile).toHaveBeenCalledWith(reportsConfig.summaryReportName, csv)
  })

  test('should write csv to summary report file once if report lines', async () => {
    await createSummaryReport()
    expect(mockWriteFile).toHaveBeenCalledTimes(1)
  })

  test('should not write csv to summary report file if no report lines', async () => {
    mockGetReportLines.mockReturnValue([])
    await createSummaryReport()
    expect(mockWriteFile).not.toHaveBeenCalled()
  })
})
