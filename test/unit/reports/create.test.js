jest.mock('../../../app/reports/mi-report/get-events')
const { getEvents: mockGetEvents } = require('../../../app/reports/mi-report/get-events')

jest.mock('../../../app/reports/mi-report/group-events-by-correlation-id')
const { groupEventsByCorrelationId: mockGroupEventsByCorrelationId } = require('../../../app/reports/mi-report/group-events-by-correlation-id')

jest.mock('../../../app/reports/mi-report/order-grouped-events')
const { orderGroupedEvents: mockOrderGroupedEvents } = require('../../../app/reports/mi-report/order-grouped-events')

jest.mock('../../../app/reports/mi-report/get-report-lines')
const { getReportLines: mockGetReportLines } = require('../../../app/reports/mi-report/get-report-lines')

jest.mock('../../../app/reports/mi-report/convert-to-csv')
const { convertToCSV: mockConvertToCSV } = require('../../../app/reports/mi-report/convert-to-csv')

jest.mock('../../../app/storage')
const { writeFile: mockWriteFile } = require('../../../app/storage')

const { reportsConfig } = require('../../../app/config')
const { createMIReport } = require('../../../app/reports/mi-report/create')

const event = require('../../mocks/events/event')
const groupedEvent = require('../../mocks/events/grouped-event')
const reportLine = require('../../mocks/report-lines/mi')
const csv = require('../../mocks/csv')

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
    expect(mockGetReportLines).toHaveBeenCalledWith([groupedEvent])
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
