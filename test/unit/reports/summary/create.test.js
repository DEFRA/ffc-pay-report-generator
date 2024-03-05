jest.mock('../../../../app/reports/summary/get-report-lines')
const { getReportLines: mockGetReportLines } = require('../../../../app/reports/summary/get-report-lines')

jest.mock('../../../../app/reports/convert-to-csv')
const { convertToCSV: mockConvertToCSV } = require('../../../../app/reports/convert-to-csv')

jest.mock('../../../../app/storage')
const { writeFile: mockWriteFile } = require('../../../../app/storage')

const { reportsConfig } = require('../../../../app/config')
const { createSummaryReport } = require('../../../../app/reports/summary/create')

const groupedEvent = require('../../../mocks/events/grouped-event')
const reportLine = require('../../../mocks/report-lines/summary')
const csv = require('../../../mocks/csv')

describe('create summary report', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockGetReportLines.mockReturnValue([reportLine])
    mockConvertToCSV.mockReturnValue(csv)
  })

  test('should get report lines', async () => {
    await createSummaryReport([groupedEvent])
    expect(mockGetReportLines).toHaveBeenCalledWith([groupedEvent])
  })

  test('should get report lines once', async () => {
    await createSummaryReport([groupedEvent])
    expect(mockGetReportLines).toHaveBeenCalledTimes(1)
  })

  test('should convert report lines to csv if report lines', async () => {
    await createSummaryReport([groupedEvent])
    expect(mockConvertToCSV).toHaveBeenCalledWith([reportLine])
  })

  test('should convert report lines to csv once if report lines', async () => {
    await createSummaryReport([groupedEvent])
    expect(mockConvertToCSV).toHaveBeenCalledTimes(1)
  })

  test('should not convert report lines to csv if no report lines', async () => {
    mockGetReportLines.mockReturnValue([])
    await createSummaryReport([groupedEvent])
    expect(mockConvertToCSV).not.toHaveBeenCalled()
  })

  test('should write csv to summary report file if report lines', async () => {
    await createSummaryReport([groupedEvent])
    expect(mockWriteFile).toHaveBeenCalledWith(reportsConfig.summaryReportName, csv)
  })

  test('should write csv to summary report file once if report lines', async () => {
    await createSummaryReport([groupedEvent])
    expect(mockWriteFile).toHaveBeenCalledTimes(1)
  })

  test('should not write csv to summary report file if no report lines', async () => {
    mockGetReportLines.mockReturnValue([])
    await createSummaryReport([groupedEvent])
    expect(mockWriteFile).not.toHaveBeenCalled()
  })
})
