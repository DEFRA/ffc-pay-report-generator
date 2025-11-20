jest.mock('../../../../app/storage')
const { getClient: mockGetClient, odata: mockOdata } = require('../../../../app/storage')

const mockListEntities = jest.fn()
const mockTableClient = { listEntities: mockListEntities }

const { PAYMENT_EVENT } = require('../../../../app/constants/event-types')
const { stringifyEventData } = require('../../../helpers/stringify-event-data')
const { getEvents } = require('../../../../app/reports/shared/get-events')

let extractedEvent
let enrichedEvent
let events

describe('get events', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    extractedEvent = structuredClone(require('../../../mocks/events/extracted'))
    enrichedEvent = structuredClone(require('../../../mocks/events/enriched'))

    stringifyEventData(extractedEvent)
    stringifyEventData(enrichedEvent)

    events = [extractedEvent, enrichedEvent]

    mockGetClient.mockReturnValue(mockTableClient)
    mockListEntities.mockReturnValue(events)
  })

  test('gets payment client', async () => {
    await getEvents()
    expect(mockGetClient).toHaveBeenCalledTimes(1)
    expect(mockGetClient).toHaveBeenCalledWith(PAYMENT_EVENT)
  })

  test('gets payment events', async () => {
    await getEvents()
    expect(mockListEntities).toHaveBeenCalledTimes(1)
    expect(mockListEntities).toHaveBeenCalledWith({
      queryOptions: { filter: mockOdata`category eq 'correlationId'` }
    })
  })

  test('returns all payment events', async () => {
    const result = await getEvents()
    expect(result).toHaveLength(2)
  })

  test('converts event data to json', async () => {
    const result = await getEvents()
    expect(result[0].data).toEqual(extractedEvent.data)
    expect(result[1].data).toEqual(enrichedEvent.data)
  })

  test('returns empty array when no events', async () => {
    mockListEntities.mockReturnValue([])
    const result = await getEvents()
    expect(result).toHaveLength(0)
  })
})
