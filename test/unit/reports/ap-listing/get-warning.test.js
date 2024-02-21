jest.mock('../../../../app/storage')
const { getClient: mockGetClient, odata: mockOdata } = require('../../../../app/storage')

const mockListEntities = jest.fn()

const mockTableClient = {
  listEntities: mockListEntities
}

const { WARNING_EVENT } = require('../../../../app/constants/event-types')

const { stringifyEventData } = require('../../../helpers/stringify-event-data')

const { getWarning } = require('../../../../app/reports/ap-listing/get-warning')
const { CORRELATION_ID } = require('../../../mocks/values/correlation-id')

let warningEvent
let filter

describe('get warning', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    filter = mockOdata`JSON.parse(data).correlationId eq ${CORRELATION_ID}`
    warningEvent = JSON.parse(JSON.stringify(require('../../../mocks/events/warning')))

    stringifyEventData(warningEvent)

    mockGetClient.mockReturnValue(mockTableClient)
    mockListEntities.mockReturnValue([warningEvent])
  })

  test('should get client', async () => {
    await getWarning(filter)
    expect(mockGetClient).toHaveBeenCalledTimes(1)
  })

  test('should get client once', async () => {
    await getWarning(filter)
    expect(mockGetClient).toHaveBeenCalledTimes(1)
  })

  test('should get client with warning event type', async () => {
    await getWarning(filter)
    expect(mockGetClient).toHaveBeenCalledWith(WARNING_EVENT)
  })

  test('should get events once', async () => {
    await getWarning(filter)
    expect(mockListEntities).toHaveBeenCalledTimes(1)
  })

  test('should get events with given filter, order by time and return most recent', async () => {
    await getWarning(filter)
    expect(mockListEntities).toHaveBeenCalledWith({ queryOptions: { filter, orderby: mockOdata`time desc`, top: 1 } })
  })

  test('should return one event', async () => {
    const result = await getWarning(filter)
    expect(result).toBe(warningEvent)
  })

  test('should convert event data to json', async () => {
    const result = await getWarning(filter)
    expect(result.data).toEqual(warningEvent.data)
  })

  test('should return null if no warning', async () => {
    mockListEntities.mockReturnValue([])
    const result = await getWarning(filter)
    expect(result).toBe(null)
  })
})
