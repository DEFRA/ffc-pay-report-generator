jest.mock('../../../../app/reports/shared/get-events')
const { getEvents: mockGetEvents } = require('../../../../app/reports/shared/get-events')

jest.mock('../../../../app/reports/shared/group-events-by-correlation-id')
const { groupEventsByCorrelationId: mockGroupEventsByCorrelationId } = require('../../../../app/reports/shared/group-events-by-correlation-id')

jest.mock('../../../../app/reports/shared/order-grouped-events')
const { orderGroupedEvents: mockOrderGroupedEvents } = require('../../../../app/reports/shared/order-grouped-events')

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

const event = require('../../../mocks/events/event')
const groupedEvent = require('../../../mocks/events/grouped-event')
const apReportLine = require('../../../mocks/report-lines/ap')
const csv = require('../../../mocks/csv')

describe('create ap + ar reports', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockGetEvents.mockResolvedValue([event])
    mockGroupEventsByCorrelationId.mockReturnValue([groupedEvent])
    mockOrderGroupedEvents.mockReturnValue([groupedEvent])
    mockSplitAPAREvents.mockReturnValue({ apEvents: [groupedEvent], arEvents: [groupedEvent] })
    mockGetReportLines.mockReturnValue([apReportLine])
    mockConvertToCSV.mockReturnValue(csv)
  })

  test('should get all payment events', async () => {
    await createAPARListingReport()
    expect(mockGetEvents).toHaveBeenCalledTimes(1)
  })

  test('should group events by correlation id', async () => {
    await createAPARListingReport()
    expect(mockGroupEventsByCorrelationId).toHaveBeenCalledWith([event])
  })

  test('should group events by correlation id once', async () => {
    await createAPARListingReport()
    expect(mockGroupEventsByCorrelationId).toHaveBeenCalledTimes(1)
  })

  test('should order grouped events', async () => {
    await createAPARListingReport()
    expect(mockOrderGroupedEvents).toHaveBeenCalledWith([groupedEvent])
  })

  test('should order grouped events once', async () => {
    await createAPARListingReport()
    expect(mockOrderGroupedEvents).toHaveBeenCalledTimes(1)
  })

  test('should split ap and ar events', async () => {
    await createAPARListingReport()
    expect(mockSplitAPAREvents).toHaveBeenCalledWith([groupedEvent])
  })

  test('should split ap and ar events once', async () => {
    await createAPARListingReport()
    expect(mockSplitAPAREvents).toHaveBeenCalledTimes(1)
  })

  test('should get report lines twice', async () => {
    await createAPARListingReport()
    expect(mockGetReportLines).toHaveBeenCalledTimes(2)
  })

  test('should convert report lines to csv twice if report lines', async () => {
    await createAPARListingReport()
    expect(mockConvertToCSV).toHaveBeenCalledTimes(2)
  })

  test('should not convert report lines to csv if no report lines', async () => {
    mockGetReportLines.mockReturnValue([])
    await createAPARListingReport()
    expect(mockConvertToCSV).not.toHaveBeenCalled()
  })

  test('should write csv twice if report lines', async () => {
    await createAPARListingReport()
    expect(mockWriteFile).toHaveBeenCalledTimes(2)
  })

  test('should write csv to ap report file if report lines', async () => {
    await createAPARListingReport()
    expect(mockWriteFile).toHaveBeenCalledWith(reportsConfig.apListingReportName, csv)
  })

  test('should write csv to ar report file if report lines', async () => {
    await createAPARListingReport()
    expect(mockWriteFile).toHaveBeenCalledWith(reportsConfig.arListingReportName, csv)
  })

  test('should not write csv file if no report lines', async () => {
    mockGetReportLines.mockReturnValue([])
    await createAPARListingReport()
    expect(mockWriteFile).not.toHaveBeenCalled()
  })
})
