jest.mock('../../../../app/storage')
const { getClient: mockGetClient, odata: mockOdata } = require('../../../../app/storage')

const mockListEntities = jest.fn()
const mockTableClient = { listEntities: mockListEntities }

const { PAYMENT_EVENT } = require('../../../../app/constants/event-types')
const { PAYMENT_SUPPRESSED } = require('../../../../app/constants/events')

const { stringifyEventData } = require('../../../helpers/stringify-event-data')
const { getEvents } = require('../../../../app/reports/shared/get-events')

let suppressedEvent
let events

describe('get events (suppressed)', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    suppressedEvent = structuredClone(require('../../../mocks/events/suppressed'))
    stringifyEventData(suppressedEvent)

    events = [suppressedEvent]

    mockGetClient.mockReturnValue(mockTableClient)
    mockListEntities.mockReturnValue(events)
  })

  test('gets payment client with correct event type', async () => {
    await getEvents()
    expect(mockGetClient).toHaveBeenCalledWith(PAYMENT_EVENT)
  })

  test('queries suppressed events by frn category', async () => {
    await getEvents()
    expect(mockListEntities).toHaveBeenCalledWith({
      queryOptions: {
        filter: mockOdata`category eq 'frn' and type eq '${PAYMENT_SUPPRESSED}'`
      }
    })
  })

  test('returns all suppressed payment events', async () => {
    const result = await getEvents()
    expect(result).toHaveLength(1)
  })

  test('converts event data to json', async () => {
    const result = await getEvents()
    expect(result[0].data).toEqual(suppressedEvent.data)
  })

  test('returns empty array when no events returned', async () => {
    mockListEntities.mockReturnValue([])
    const result = await getEvents()
    expect(result).toHaveLength(0)
  })
})
