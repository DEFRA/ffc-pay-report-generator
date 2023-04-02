const { reportsConfig } = require('../../../app/config')
const { stringifyEventData } = require('../../helpers/stringify-event-data')

jest.mock('../../../app/storage')
const { getClient: mockGetClient, writeFile: mockWriteFile } = require('../../../app/storage')

const mockListEntities = jest.fn()

const mockTableClient = {
  listEntities: mockListEntities
}

const { createMIReport } = require('../../../app/reports/mi-report')

let extractedEvent
let enrichedEvent
let events

describe('create mi report', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    extractedEvent = JSON.parse(JSON.stringify(require('../../mocks/events/extracted')))
    enrichedEvent = JSON.parse(JSON.stringify(require('../../mocks/events/enriched')))

    stringifyEventData(extractedEvent)
    stringifyEventData(enrichedEvent)

    events = [extractedEvent, enrichedEvent]

    mockGetClient.mockReturnValue(mockTableClient)
    mockListEntities.mockReturnValue(events)
  })

  test('test should write report to blob storage', async () => {
    await createMIReport()
    expect(mockWriteFile).toHaveBeenCalledTimes(1)
  })

  test('test should write report to blob storage with correct file name', async () => {
    await createMIReport()
    expect(mockWriteFile).toHaveBeenCalledWith(reportsConfig.miReportName, expect.any(String))
  })
})
