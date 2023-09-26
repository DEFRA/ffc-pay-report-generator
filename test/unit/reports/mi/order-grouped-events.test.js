jest.mock('../../../../app/reports/mi/get-event-order')
const { getEventOrder } = require('../../../../app/reports/mi/get-event-order')

const { orderGroupedEvents } = require('../../../../app/reports/mi/order-grouped-events')

let events

describe('order grouped events', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    events = [{
      events: [{
        id: '2'
      }, {
        id: '1'
      }]
    }]
  })

  test('should order events by event order', () => {
    getEventOrder.mockReturnValueOnce(0)
    getEventOrder.mockReturnValueOnce(1)
    const result = orderGroupedEvents(events)
    expect(result[0].events[0].id).toEqual('1')
  })
})
