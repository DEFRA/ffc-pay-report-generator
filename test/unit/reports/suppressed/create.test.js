jest.mock('../../../../app/reports/suppressed/get-events')
const { getEvents: mockGetEvents } = require('../../../../app/reports/suppressed/get-events')

jest.mock('../../../../app/reports/suppressed/get-report-lines')
const { getReportLines: mockGetReportLines } = require('../../../../app/reports/suppressed/get-report-lines')

jest.mock('../../../../app/reports/convert-to-csv')
const { convertToCSV: mockConvertToCSV } = require('../../../../app/reports/convert-to-csv')

jest.mock('../../../../app/storage')
const { writeFile: mockWriteFile } = require('../../../../app/storage')

const { reportsConfig } = require('../../../../app/config')

const { createSuppressedReport } = require('../../../../app/reports/suppressed/create')

const event = require('../../../mocks/events/suppressed')
const reportLine = require('../../../mocks/report-lines/suppressed')
const csv = require('../../../mocks/csv')

describe('create suppressed report', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockGetEvents.mockResolvedValue([event])
    mockGetReportLines.mockReturnValue([reportLine])
    mockConvertToCSV.mockReturnValue(csv)
  })

  test('should get all payment events', async () => {
    await createSuppressedReport()
    expect(mockGetEvents).toHaveBeenCalledTimes(1)
  })

  test('should get report lines', async () => {
    await createSuppressedReport()
    expect(mockGetReportLines).toHaveBeenCalledWith([event])
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

  test('should write csv to suppressed report file if report lines', async () => {
    await createSuppressedReport()
    expect(mockWriteFile).toHaveBeenCalledWith(reportsConfig.suppressedReportName, csv)
  })

  test('should write csv to suppressed report file once if report lines', async () => {
    await createSuppressedReport()
    expect(mockWriteFile).toHaveBeenCalledTimes(1)
  })

  test('should not write csv to suppressed report file if no report lines', async () => {
    mockGetReportLines.mockReturnValue([])
    await createSuppressedReport()
    expect(mockWriteFile).not.toHaveBeenCalled()
  })
})
