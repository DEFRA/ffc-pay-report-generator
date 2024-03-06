jest.mock('../../../../app/reports/shared/get-events')
const { getEvents: mockGetEvents } = require('../../../../app/reports/shared/get-events')

jest.mock('../../../../app/reports/shared/group-events-by-correlation-id')
const { groupEventsByCorrelationId: mockGroupEventsByCorrelationId } = require('../../../../app/reports/shared/group-events-by-correlation-id')

jest.mock('../../../../app/reports/shared/order-grouped-events')
const { orderGroupedEvents: mockOrderGroupedEvents } = require('../../../../app/reports/shared/order-grouped-events')

jest.mock('../../../../app/reports/mi/create')
const { createMIReport } = require('../../../../app/reports/mi/create')

jest.mock('../../../../app/reports/summary/create')
const { createSummaryReport } = require('../../../../app/reports/summary/create')

jest.mock('../../../../app/reports/ap-ar-listing/create')
const { createAPARListingReport } = require('../../../../app/reports/ap-ar-listing/create')

const { createReportsWithSharedData } = require('../../../../app/reports/shared/create')

const event = require('../../../mocks/events/event')
const groupedEvent = require('../../../mocks/events/grouped-event')

describe('create reports with shared events', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockGetEvents.mockResolvedValue([event])
    mockGroupEventsByCorrelationId.mockReturnValue([groupedEvent])
    mockOrderGroupedEvents.mockReturnValue([groupedEvent])
  })

  test('should get all payment events', async () => {
    await createReportsWithSharedData()
    expect(mockGetEvents).toHaveBeenCalledTimes(1)
  })

  test('should group events by correlation id', async () => {
    await createReportsWithSharedData()
    expect(mockGroupEventsByCorrelationId).toHaveBeenCalledWith([event])
  })

  test('should group events by correlation id once', async () => {
    await createReportsWithSharedData()
    expect(mockGroupEventsByCorrelationId).toHaveBeenCalledTimes(1)
  })

  test('should order grouped events', async () => {
    await createReportsWithSharedData()
    expect(mockOrderGroupedEvents).toHaveBeenCalledWith([groupedEvent])
  })

  test('should order grouped events once', async () => {
    await createReportsWithSharedData()
    expect(mockOrderGroupedEvents).toHaveBeenCalledTimes(1)
  })

  test('should call createMIReport', async () => {
    await createReportsWithSharedData()
    expect(createMIReport).toHaveBeenCalledWith([groupedEvent])
  })

  test('should call createMIReport once', async () => {
    await createReportsWithSharedData()
    expect(createMIReport).toHaveBeenCalledTimes(1)
  })

  test('should call createAPARListingReport', async () => {
    await createReportsWithSharedData()
    expect(createAPARListingReport).toHaveBeenCalledWith([groupedEvent])
  })

  test('should call createAPARListingReport once', async () => {
    await createReportsWithSharedData()
    expect(createAPARListingReport).toHaveBeenCalledTimes(1)
  })

  test('should call createSummaryReport', async () => {
    await createReportsWithSharedData()
    expect(createSummaryReport).toHaveBeenCalledWith([groupedEvent])
  })

  test('should call createSummaryReport once', async () => {
    await createReportsWithSharedData()
    expect(createSummaryReport).toHaveBeenCalledTimes(1)
  })
})
