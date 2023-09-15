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
const { createMIReport } = require('../../../app/reports/create-mi-report')

const event = require('../../mocks/events/mi/event')
const groupedEvent = require('../../mocks/events/mi/grouped-event')
const reportLine = require('../../mocks/mi-report-line')
const csv = require('../../mocks/csv')
const { MI_REPORT } = require('../../../app/constants/report-types')

describe('create mi report', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockGetEvents.mockResolvedValue([event])
    mockGroupEventsByCorrelationId.mockReturnValue([groupedEvent])
    mockOrderGroupedEvents.mockReturnValue([groupedEvent])
    mockGetReportLines.mockReturnValue([reportLine])
    mockConvertToCSV.mockReturnValue(csv)
  })

  test('should get all payment events', async () => {
    await createMIReport()
    expect(mockGetEvents).toHaveBeenCalledTimes(1)
  })

  test('should group events by correlation id', async () => {
    await createMIReport()
    expect(mockGroupEventsByCorrelationId).toHaveBeenCalledWith([event])
  })

  test('should group events by correlation id once', async () => {
    await createMIReport()
    expect(mockGroupEventsByCorrelationId).toHaveBeenCalledTimes(1)
  })

  test('should order grouped events', async () => {
    await createMIReport()
    expect(mockOrderGroupedEvents).toHaveBeenCalledWith([groupedEvent])
  })

  test('should order grouped events once', async () => {
    await createMIReport()
    expect(mockOrderGroupedEvents).toHaveBeenCalledTimes(1)
  })

  test('should get report lines', async () => {
    await createMIReport()
    expect(mockGetReportLines).toHaveBeenCalledWith([groupedEvent], MI_REPORT)
  })

  test('should get report lines once', async () => {
    await createMIReport()
    expect(mockGetReportLines).toHaveBeenCalledTimes(1)
  })

  test('should convert report lines to csv if report lines', async () => {
    await createMIReport()
    expect(mockConvertToCSV).toHaveBeenCalledWith([reportLine])
  })

  test('should convert report lines to csv once if report lines', async () => {
    await createMIReport()
    expect(mockConvertToCSV).toHaveBeenCalledTimes(1)
  })

  test('should not convert report lines to csv if no report lines', async () => {
    mockGetReportLines.mockReturnValue([])
    await createMIReport()
    expect(mockConvertToCSV).not.toHaveBeenCalled()
  })

  test('should write csv to MI report file if report lines', async () => {
    await createMIReport()
    expect(mockWriteFile).toHaveBeenCalledWith(reportsConfig.miReportName, csv)
  })

  test('should write csv to MI report file once if report lines', async () => {
    await createMIReport()
    expect(mockWriteFile).toHaveBeenCalledTimes(1)
  })

  test('should not write csv to MI report file if no report lines', async () => {
    mockGetReportLines.mockReturnValue([])
    await createMIReport()
    expect(mockWriteFile).not.toHaveBeenCalled()
  })
})