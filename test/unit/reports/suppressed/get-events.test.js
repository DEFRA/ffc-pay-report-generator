jest.mock('../../../../app/storage')
const { getClient: mockGetClient, odata: mockOdata } = require('../../../../app/storage')

const mockListEntities = jest.fn()

const mockTableClient = {
  listEntities: mockListEntities
}

const { PAYMENT_EVENT } = require('../../../../app/constants/event-types')
const { PAYMENT_SUPPRESSED } = require('../../../../app/constants/events')

const { stringifyEventData } = require('../../../helpers/stringify-event-data')

const { getEvents } = require('../../../../app/reports/mi/get-events')

let suppressedEvent
let events

describe('get events', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    suppressedEvent = JSON.parse(JSON.stringify(require('../../../mocks/events/suppressed')))

    stringifyEventData(suppressedEvent)

    events = [suppressedEvent]

    mockGetClient.mockReturnValue(mockTableClient)
    mockListEntities.mockReturnValue(events)
  })

  test('should get payment client', async () => {
    await getEvents()
    expect(mockGetClient).toHaveBeenCalledTimes(1)
  })

  test('should get payment client once', async () => {
    await getEvents()
    expect(mockGetClient).toHaveBeenCalledTimes(1)
  })

  test('should get payment client with payment event type', async () => {
    await getEvents()
    expect(mockGetClient).toHaveBeenCalledWith(PAYMENT_EVENT)
  })

  test('should get payment events once', async () => {
    await getEvents()
    expect(mockListEntities).toHaveBeenCalledTimes(1)
  })

  test('should get payment events with frn category and only suppressed events', async () => {
    await getEvents()
    expect(mockListEntities).toHaveBeenCalledWith({ queryOptions: { filter: mockOdata`category eq 'frn' and type eq '${PAYMENT_SUPPRESSED}'` } })
  })

  test('should return all payment events', async () => {
    const result = await getEvents()
    expect(result.length).toBe(1)
  })

  test('should convert event data to json', async () => {
    const result = await getEvents()
    expect(result[0].data).toEqual(suppressedEvent.data)
  })

  test('should return an empty array if no events', async () => {
    mockListEntities.mockReturnValue([])
    const result = await getEvents()
    expect(result.length).toBe(0)
  })
})
