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
  let consoleSpy

  beforeEach(() => {
    jest.clearAllMocks()
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    mockGetEvents.mockResolvedValue([event])
    mockGetReportLines.mockReturnValue([reportLine])
    mockConvertToCSV.mockReturnValue(csv)
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  test('gets suppressed payment events', async () => {
    await createSuppressedReport()
    expect(mockGetEvents).toHaveBeenCalledTimes(1)
  })

  test('logs number of events obtained', async () => {
    await createSuppressedReport()
    expect(consoleSpy).toHaveBeenCalledWith(
      'Obtained events for suppressed reports - 1 report entries'
    )
  })

  test('gets report lines for events', async () => {
    await createSuppressedReport()
    expect(mockGetReportLines).toHaveBeenCalledWith([event])
  })

  test('converts report lines to CSV when present', async () => {
    await createSuppressedReport()
    expect(mockConvertToCSV).toHaveBeenCalledWith([reportLine])
  })

  test('writes CSV to storage when report lines exist', async () => {
    await createSuppressedReport()
    expect(mockWriteFile).toHaveBeenCalledWith(
      reportsConfig.suppressedReportName,
      csv
    )
  })

  test('logs created report message', async () => {
    await createSuppressedReport()
    expect(consoleSpy).toHaveBeenCalledWith(
      `Suppressed report created: ${reportsConfig.suppressedReportName}`
    )
  })

  describe('when no report lines exist', () => {
    beforeEach(() => {
      mockGetReportLines.mockReturnValue([])
    })

    test('does not convert to CSV', async () => {
      await createSuppressedReport()
      expect(mockConvertToCSV).not.toHaveBeenCalled()
    })

    test('does not write a file', async () => {
      await createSuppressedReport()
      expect(mockWriteFile).not.toHaveBeenCalled()
    })

    test('logs not created message', async () => {
      await createSuppressedReport()
      expect(consoleSpy).toHaveBeenCalledWith(
        'Suppressed report not created, no data'
      )
    })
  })
})
