jest.mock('../../../../app/reports/mi/get-report-lines')
const { getReportLines: mockGetReportLines } = require('../../../../app/reports/mi/get-report-lines')

jest.mock('../../../../app/reports/convert-to-csv')
const { convertToCSV: mockConvertToCSV } = require('../../../../app/reports/convert-to-csv')

jest.mock('../../../../app/storage')
const { writeFile: mockWriteFile } = require('../../../../app/storage')

const { reportsConfig } = require('../../../../app/config')
const { createMIReport } = require('../../../../app/reports/mi/create')

const groupedEvent = require('../../../mocks/events/grouped-event')
const reportLine = require('../../../mocks/report-lines/mi')
const csv = require('../../../mocks/csv')

describe('create mi report', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetReportLines.mockReturnValue([reportLine])
    mockConvertToCSV.mockReturnValue(csv)
  })

  test.each([
    ['calls getReportLines', () => expect(mockGetReportLines).toHaveBeenCalledWith([groupedEvent])],
    ['calls getReportLines once', () => expect(mockGetReportLines).toHaveBeenCalledTimes(1)],
    ['converts lines to csv', () => expect(mockConvertToCSV).toHaveBeenCalledWith([reportLine])],
    ['converts lines to csv once', () => expect(mockConvertToCSV).toHaveBeenCalledTimes(1)],
    ['writes csv file', () => expect(mockWriteFile).toHaveBeenCalledWith(reportsConfig.miReportName, csv)],
    ['writes csv file once', () => expect(mockWriteFile).toHaveBeenCalledTimes(1)]
  ])('%s', async (name, assertion) => {
    await createMIReport([groupedEvent])
    assertion()
  })

  test('does not convert to csv when no lines', async () => {
    mockGetReportLines.mockReturnValue([])
    await createMIReport([groupedEvent])
    expect(mockConvertToCSV).not.toHaveBeenCalled()
  })

  test('does not write file when no lines', async () => {
    mockGetReportLines.mockReturnValue([])
    await createMIReport([groupedEvent])
    expect(mockWriteFile).not.toHaveBeenCalled()
  })
})
