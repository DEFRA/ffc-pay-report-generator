jest.mock('../../../app/storage')
const { getClient: mockGetClient, writeFile: mockWriteFile } = require('../../../app/storage')

const mockListEntities = jest.fn()

const mockTableClient = {
  listEntities: mockListEntities
}

const { reportsConfig } = require('../../../app/config')
const { stringifyEventData } = require('../../helpers/stringify-event-data')
const { createSuppressedReport } = require('../../../app/reports/suppressed/create')

let extractedEvent
let enrichedEvent
let resetEvent
let events

describe('create mi report', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    extractedEvent = structuredClone(require('../../mocks/events/extracted'))
    enrichedEvent = structuredClone(require('../../mocks/events/enriched'))
    resetEvent = structuredClone(require('../../mocks/events/reset'))

    stringifyEventData(extractedEvent)
    stringifyEventData(enrichedEvent)
    stringifyEventData(resetEvent)

    events = [extractedEvent, enrichedEvent, resetEvent]

    mockGetClient.mockReturnValue(mockTableClient)
    mockListEntities.mockReturnValue(events)
  })

  test('should write report to blob storage', async () => {
    await createSuppressedReport()
    expect(mockWriteFile).toHaveBeenCalledTimes(1)
  })

  test('should write report to blob storage with correct file name', async () => {
    await createSuppressedReport()
    expect(mockWriteFile).toHaveBeenCalledWith(reportsConfig.suppressedReportName, expect.any(String))
  })
})
