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
  let logSpy

  beforeEach(() => {
    jest.clearAllMocks()
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    mockGetEvents.mockResolvedValue([event])
    mockGroupEventsByCorrelationId.mockReturnValue([groupedEvent])
    mockOrderGroupedEvents.mockReturnValue([groupedEvent])
  })

  afterEach(() => {
    logSpy.mockRestore()
  })

  test('logs number of events', async () => {
    await createReportsWithSharedData()
    expect(logSpy).toHaveBeenCalledWith(
      'Obtained events for shared data reports - 1 report entries'
    )
  })

  test.each([
    ['gets payment events', mockGetEvents, [], 1],
    ['groups events', mockGroupEventsByCorrelationId, [[event]], 1],
    ['orders grouped events', mockOrderGroupedEvents, [[groupedEvent]], 1],
    ['creates MI report', createMIReport, [[groupedEvent]], 1]
  ])('%s', async (name, fn, args, count) => {
    await createReportsWithSharedData()
    expect(fn).toHaveBeenCalledWith(...args)
    expect(fn).toHaveBeenCalledTimes(count)
  })
})
