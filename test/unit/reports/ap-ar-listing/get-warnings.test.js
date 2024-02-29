jest.mock('../../../../app/storage')
const { getClient: mockGetClient, odata: mockOdata } = require('../../../../app/storage')

const mockListEntities = jest.fn()

const mockTableClient = {
  listEntities: mockListEntities
}

const { WARNING_EVENT } = require('../../../../app/constants/event-types')

const { stringifyEventData } = require('../../../helpers/stringify-event-data')

const { getWarnings } = require('../../../../app/reports/ap-ar-listing/get-warnings')
const { CORRELATION_ID } = require('../../../mocks/values/correlation-id')

let warningEvent
let filter

describe('get warnings', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    filter = mockOdata`JSON.parse(data).correlationId eq ${CORRELATION_ID}`
    warningEvent = JSON.parse(JSON.stringify(require('../../../mocks/events/warning')))

    stringifyEventData(warningEvent)

    mockGetClient.mockReturnValue(mockTableClient)
    mockListEntities.mockReturnValue([warningEvent])
  })

  test('should get client', async () => {
    await getWarnings(filter)
    expect(mockGetClient).toHaveBeenCalledTimes(1)
  })

  test('should get client once', async () => {
    await getWarnings(filter)
    expect(mockGetClient).toHaveBeenCalledTimes(1)
  })

  test('should get client with warning event type', async () => {
    await getWarnings(filter)
    expect(mockGetClient).toHaveBeenCalledWith(WARNING_EVENT)
  })

  test('should get events once', async () => {
    await getWarnings(filter)
    expect(mockListEntities).toHaveBeenCalledTimes(1)
  })

  test('should get events with given filter, order by time', async () => {
    await getWarnings(filter)
    expect(mockListEntities).toHaveBeenCalledWith({ queryOptions: { filter, orderby: mockOdata`time desc` } })
  })

  test('should get events if no filter, order by time', async () => {
    await getWarnings(null)
    expect(mockListEntities).toHaveBeenCalledWith({ queryOptions: { orderby: mockOdata`time desc` } })
  })

  test('should return events an array', async () => {
    const result = await getWarnings(filter)
    expect(result).toEqual([warningEvent])
  })

  test('should convert event data to json for each', async () => {
    const result = await getWarnings(filter)
    expect(result[0].data).toEqual(warningEvent.data)
  })

  test('should return empty array if no warning', async () => {
    mockListEntities.mockReturnValue([])
    const result = await getWarnings(filter)
    expect(result).toEqual([])
  })
})
