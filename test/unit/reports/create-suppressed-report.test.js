jest.mock('../../../app/reports/report-processing/get-events')
const { getEvents: mockGetEvents } = require('../../../app/reports/report-processing/get-events')

jest.mock('../../../app/reports/report-processing/group-events-by-correlation-id')
const { groupEventsByCorrelationId: mockGroupEventsByCorrelationId } = require('../../../app/reports/report-processing/group-events-by-correlation-id')

jest.mock('../../../app/reports/report-processing/order-grouped-events')
const { orderGroupedEvents: mockOrderGroupedEvents } = require('../../../app/reports/report-processing/order-grouped-events')

jest.mock('../../../app/reports/report-processing/get-report-lines')
const { getReportLines: mockGetReportLines } = require('../../../app/reports/report-processing/get-report-lines')

jest.mock('../../../app/reports/report-processing/convert-to-csv')
const { convertToCSV: mockConvertToCSV } = require('../../../app/reports/report-processing/convert-to-csv')

jest.mock('../../../app/storage')
const { writeFile: mockWriteFile } = require('../../../app/storage')

const { reportsConfig } = require('../../../app/config')
const { createSuppressedReport } = require('../../../app/reports/create-suppressed-report')

const event = require('../../mocks/events/suppressed/suppressed')
const groupedEvent = require('../../mocks/events/suppressed/grouped-event')
const reportLine = require('../../mocks/suppressed-report-line')
const csv = require('../../mocks/csv')
const { SUPPRESSED_REPORT } = require('../../../app/constants/report-types')

describe('create suppressed report', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockGetEvents.mockResolvedValue([event])
    mockGroupEventsByCorrelationId.mockReturnValue([groupedEvent])
    mockOrderGroupedEvents.mockReturnValue([groupedEvent])
    mockGetReportLines.mockReturnValue([reportLine])
    mockConvertToCSV.mockReturnValue(csv)
  })

  test('should get all payment events', async () => {
    await createSuppressedReport()
    expect(mockGetEvents).toHaveBeenCalledTimes(1)
  })

  test('should group events by correlation id', async () => {
    await createSuppressedReport()
    expect(mockGroupEventsByCorrelationId).toHaveBeenCalledWith([event])
  })

  test('should group events by correlation id once', async () => {
    await createSuppressedReport()
    expect(mockGroupEventsByCorrelationId).toHaveBeenCalledTimes(1)
  })

  test('should order grouped events', async () => {
    await createSuppressedReport()
    expect(mockOrderGroupedEvents).toHaveBeenCalledWith([groupedEvent])
  })

  test('should order grouped events once', async () => {
    await createSuppressedReport()
    expect(mockOrderGroupedEvents).toHaveBeenCalledTimes(1)
  })

  test('should get report lines', async () => {
    await createSuppressedReport()
    expect(mockGetReportLines).toHaveBeenCalledWith([groupedEvent], SUPPRESSED_REPORT)
  })

  test('should get report lines once', async () => {
    await createSuppressedReport()
    expect(mockGetReportLines).toHaveBeenCalledTimes(1)
  })

  test('should convert report lines to csv if report lines', async () => {
    await createSuppressedReport()
    expect(mockConvertToCSV).toHaveBeenCalledWith([reportLine])
  })

  test('should convert report lines to csv once if report lines', async () => {
    await createSuppressedReport()
    expect(mockConvertToCSV).toHaveBeenCalledTimes(1)
  })

  test('should not convert report lines to csv if no report lines', async () => {
    mockGetReportLines.mockReturnValue([])
    await createSuppressedReport()
    expect(mockConvertToCSV).not.toHaveBeenCalled()
  })

  test('should write csv to MI report file if report lines', async () => {
    await createSuppressedReport()
    expect(mockWriteFile).toHaveBeenCalledWith(reportsConfig.miReportName, csv)
  })

  test('should write csv to MI report file once if report lines', async () => {
    await createSuppressedReport()
    expect(mockWriteFile).toHaveBeenCalledTimes(1)
  })

  test('should not write csv to MI report file if no report lines', async () => {
    mockGetReportLines.mockReturnValue([])
    await createSuppressedReport()
    expect(mockWriteFile).not.toHaveBeenCalled()
  })
})
