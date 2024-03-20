const { createAPARListingReport } = require('../../../../app/reports/ap-ar-listing/create')
const { get } = require('../../../../app/api')
const { writeFile } = require('../../../../app/storage')
const { getReportLines } = require('../../../../app/reports/ap-ar-listing/get-report-lines')
const { sanitizeReports } = require('../../../../app/reports/ap-ar-listing/sanitize-reports')
const { convertToCSV } = require('../../../../app/reports/convert-to-csv')

jest.mock('../../../../app/api')
jest.mock('../../../../app/storage')
jest.mock('../../../../app/reports/ap-ar-listing/get-report-lines')
jest.mock('../../../../app/reports/ap-ar-listing/sanitize-reports')
jest.mock('../../../../app/reports/convert-to-csv')

describe('createAPARListingReport', () => {
  test('should create AP and AR listing reports', async () => {
    get.mockResolvedValue({ payload: { reportData: [] } })
    getReportLines.mockReturnValue([])
    sanitizeReports.mockReturnValue({ apReportLines: [{}], arReportLines: [{}] })
    convertToCSV.mockReturnValue('')

    await createAPARListingReport()

    expect(get).toHaveBeenCalledWith('/report-data')
    expect(getReportLines).toHaveBeenCalled()
    expect(sanitizeReports).toHaveBeenCalled()
    expect(convertToCSV).toHaveBeenCalledTimes(2)
    expect(writeFile).toHaveBeenCalledTimes(2)
  })
})
