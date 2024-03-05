jest.mock('../../../../app/reports/ap-ar-listing/split-ap-ar-events')
const { splitAPAREvents: mockSplitAPAREvents } = require('../../../../app/reports/ap-ar-listing/split-ap-ar-events')

jest.mock('../../../../app/reports/ap-ar-listing/get-report-lines')
const { getReportLines: mockGetReportLines } = require('../../../../app/reports/ap-ar-listing/get-report-lines')

jest.mock('../../../../app/reports/convert-to-csv')
const { convertToCSV: mockConvertToCSV } = require('../../../../app/reports/convert-to-csv')

jest.mock('../../../../app/storage')
const { writeFile: mockWriteFile } = require('../../../../app/storage')

const { reportsConfig } = require('../../../../app/config')
const { createAPARListingReport } = require('../../../../app/reports/ap-ar-listing/create')

const groupedEvent = require('../../../mocks/events/grouped-event')
const apReportLine = require('../../../mocks/report-lines/ap')
const csv = require('../../../mocks/csv')

describe('create ap + ar reports', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockSplitAPAREvents.mockReturnValue({ apEvents: [groupedEvent], arEvents: [groupedEvent] })
    mockGetReportLines.mockReturnValue([apReportLine])
    mockConvertToCSV.mockReturnValue(csv)
  })

  test('should split ap and ar events', async () => {
    await createAPARListingReport([groupedEvent])
    expect(mockSplitAPAREvents).toHaveBeenCalledWith([groupedEvent])
  })

  test('should split ap and ar events once', async () => {
    await createAPARListingReport([groupedEvent])
    expect(mockSplitAPAREvents).toHaveBeenCalledTimes(1)
  })

  test('should get report lines twice', async () => {
    await createAPARListingReport([groupedEvent])
    expect(mockGetReportLines).toHaveBeenCalledTimes(2)
  })

  test('should convert report lines to csv twice if report lines', async () => {
    await createAPARListingReport([groupedEvent])
    expect(mockConvertToCSV).toHaveBeenCalledTimes(2)
  })

  test('should not convert report lines to csv if no report lines', async () => {
    mockGetReportLines.mockReturnValue([])
    await createAPARListingReport([groupedEvent])
    expect(mockConvertToCSV).not.toHaveBeenCalled()
  })

  test('should write csv twice if report lines', async () => {
    await createAPARListingReport([groupedEvent])
    expect(mockWriteFile).toHaveBeenCalledTimes(2)
  })

  test('should write csv to ap report file if report lines', async () => {
    await createAPARListingReport([groupedEvent])
    expect(mockWriteFile).toHaveBeenCalledWith(reportsConfig.apListingReportName, csv)
  })

  test('should write csv to ar report file if report lines', async () => {
    await createAPARListingReport([groupedEvent])
    expect(mockWriteFile).toHaveBeenCalledWith(reportsConfig.arListingReportName, csv)
  })

  test('should not write csv file if no report lines', async () => {
    mockGetReportLines.mockReturnValue([])
    await createAPARListingReport([groupedEvent])
    expect(mockWriteFile).not.toHaveBeenCalled()
  })
})
