const { stringifyEventData } = require('../../helpers/stringify-event-data')

const mockListEntities = jest.fn()
const mockTableClient = {
  createTable: jest.fn(),
  listEntities: mockListEntities
}
jest.mock('@azure/data-tables', () => {
  return {
    TableClient: {
      fromConnectionString: jest.fn().mockReturnValue(mockTableClient)
    }
  }
})
const mockUpload = jest.fn()
const mockContainerClient = {
  createIfNotExists: jest.fn(),
  upload: mockUpload
}
const mockBlobServiceClient = {
  getContainerClient: jest.fn().mockReturnValue(mockContainerClient)
}
jest.mock('@azure/storage-blob', () => {
  return {
    BlobServiceClient: {
      fromConnectionString: jest.fn().mockReturnValue(mockBlobServiceClient)
    }
  }
})

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

    mockListEntities.mockReturnValue(events)
  })

  test('test should write report to blob storage', async () => {
    await createMIReport()
    expect(mockContainerClient.mockUpload).toHaveBeenCalledTimes(1)
  })
})
