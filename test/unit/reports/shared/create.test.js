jest.mock('../../../../app/reports/shared/get-events')
const { getEvents: mockGetEvents } = require('../../../../app/reports/shared/get-events')

jest.mock('../../../../app/reports/shared/group-events-by-correlation-id')
const { groupEventsByCorrelationId: mockGroupEventsByCorrelationId } = require('../../../../app/reports/shared/group-events-by-correlation-id')

jest.mock('../../../../app/reports/shared/order-grouped-events')
const { orderGroupedEvents: mockOrderGroupedEvents } = require('../../../../app/reports/shared/order-grouped-events')

jest.mock('../../../../app/reports/mi/create')
const { createMIReport } = require('../../../../app/reports/mi/create')

const { createReportsWithSharedData } = require('../../../../app/reports/shared/create')

const event = require('../../../mocks/events/event')
const groupedEvent = require('../../../mocks/events/grouped-event')

describe('create reports with shared events', () => {
  let consoleLogSpy

  beforeEach(() => {
    jest.clearAllMocks()
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    mockGetEvents.mockResolvedValue([event])
    mockGroupEventsByCorrelationId.mockReturnValue([groupedEvent])
    mockOrderGroupedEvents.mockReturnValue([groupedEvent])
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
  })

  test('should get all payment events', async () => {
    await createReportsWithSharedData()
    expect(mockGetEvents).toHaveBeenCalledTimes(1)
  })

  test('should log the number of events obtained', async () => {
    await createReportsWithSharedData()
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Obtained events for shared data reports - 1 report entries'
    )
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
})
