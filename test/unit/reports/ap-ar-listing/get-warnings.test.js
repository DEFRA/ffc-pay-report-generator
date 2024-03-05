jest.mock('../../../../app/storage')
const { getClient: mockGetClient, odata: mockOdata } = require('../../../../app/storage')

const mockListEntities = jest.fn()

const mockTableClient = {
  listEntities: mockListEntities
}

const { WARNING_EVENT } = require('../../../../app/constants/event-types')

const { stringifyEventData } = require('../../../helpers/stringify-event-data')

const { getWarnings } = require('../../../../app/reports/ap-ar-listing/get-warnings')

const acknowledgedEvent = require('../../../mocks/events/acknowledged')
const { PAYMENT_DAX_REJECTED, PAYMENT_INVALID_BANK, RECEIVER_CONNECTION_FAILED, PAYMENT_DAX_UNAVAILABLE, PAYMENT_REQUEST_BLOCKED, RESPONSE_REJECTED, PAYMENT_SETTLEMENT_UNMATCHED, PAYMENT_PROCESSING_FAILED, PAYMENT_REJECTED, BATCH_QUARANTINED, BATCH_REJECTED } = require('../../../../app/constants/warnings')

let warningEvent
let filter
let events

describe('get warnings', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    events = [acknowledgedEvent]

    warningEvent = JSON.parse(JSON.stringify(require('../../../mocks/events/warning')))

    stringifyEventData(warningEvent)

    mockGetClient.mockReturnValue(mockTableClient)
    mockListEntities.mockReturnValue([warningEvent])
  })

  test('should get client', async () => {
    await getWarnings(events, acknowledgedEvent)
    expect(mockGetClient).toHaveBeenCalledTimes(1)
  })

  test('should get client once', async () => {
    await getWarnings(events, acknowledgedEvent)
    expect(mockGetClient).toHaveBeenCalledTimes(1)
  })

  test('should get client with warning event type', async () => {
    await getWarnings(events, acknowledgedEvent)
    expect(mockGetClient).toHaveBeenCalledWith(WARNING_EVENT)
  })

  test('should get events once', async () => {
    await getWarnings(events, acknowledgedEvent)
    expect(mockListEntities).toHaveBeenCalledTimes(1)
  })

  test('should get events with specific filter if acknowledgedEvent, order by time', async () => {
    await getWarnings(events, acknowledgedEvent)
    expect(mockListEntities).toHaveBeenCalledWith({ queryOptions: { filter: mockOdata`type eq ${PAYMENT_DAX_REJECTED} or type eq ${PAYMENT_INVALID_BANK}`, orderby: mockOdata`time desc` } })
  })

  test('should get events with specific filter if no acknowledgedEvent, order by time', async () => {
    await getWarnings(events, undefined)
    expect(mockListEntities).toHaveBeenCalledWith({ queryOptions: { filter: mockOdata`type eq ${BATCH_REJECTED} or type eq ${BATCH_QUARANTINED} or type eq ${PAYMENT_REJECTED} or type eq ${PAYMENT_PROCESSING_FAILED} or type eq ${PAYMENT_SETTLEMENT_UNMATCHED} or type eq ${RESPONSE_REJECTED} or type eq ${PAYMENT_REQUEST_BLOCKED} or type eq ${PAYMENT_DAX_UNAVAILABLE} or type eq ${RECEIVER_CONNECTION_FAILED}`, orderby: mockOdata`time desc` } })
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
