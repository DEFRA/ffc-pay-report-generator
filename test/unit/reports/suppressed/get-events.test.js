const { getEvents } = require('../../../../app/reports/suppressed/get-events')
const { get } = require('../../../../app/api')
const { getDataRequestFile } = require('../../../../app/storage')
const { streamToString } = require('../../../../app/reports/suppressed/stream-to-string')
const { reportsConfig } = require('../../../../app/config')

jest.mock('../../../../app/api')
jest.mock('../../../../app/storage')
jest.mock('../../../../app/reports/suppressed/stream-to-string')

describe('getEvents', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('fetches and parses events correctly', async () => {
    const mockPayloadFile = 'mock-file.json'
    const mockFileContent = JSON.stringify([
      { id: 1, data: '{"key":"value"}' },
      { id: 2, data: { nested: 'object' } }
    ])

    get.mockResolvedValue({ payload: { file: mockPayloadFile } })
    getDataRequestFile.mockResolvedValue({ readableStreamBody: 'stream' })
    streamToString.mockResolvedValue(mockFileContent)

    const events = await getEvents()

    expect(get).toHaveBeenCalledWith(`${reportsConfig.eventHubEndpoint}/suppressed-report-data`)
    expect(getDataRequestFile).toHaveBeenCalledWith(mockPayloadFile)
    expect(streamToString).toHaveBeenCalledWith('stream')

    expect(events).toHaveLength(2)
    expect(events[0].data).toEqual({ key: 'value' })
    expect(events[1].data).toEqual({ nested: 'object' })
  })

  test('returns empty array if parsed file is not an array', async () => {
    const mockPayloadFile = 'mock-file.json'
    const mockFileContent = JSON.stringify({ not: 'an array' })

    get.mockResolvedValue({ payload: { file: mockPayloadFile } })
    getDataRequestFile.mockResolvedValue({ readableStreamBody: 'stream' })
    streamToString.mockResolvedValue(mockFileContent)

    const events = await getEvents()

    expect(events).toEqual([])
  })

  test('parses nested string data correctly', async () => {
    const mockPayloadFile = 'mock-file.json'
    const mockFileContent = JSON.stringify([
      { id: 1, data: '{"a":"b"}' },
      { id: 2, data: '{"c":1}' }
    ])

    get.mockResolvedValue({ payload: { file: mockPayloadFile } })
    getDataRequestFile.mockResolvedValue({ readableStreamBody: 'stream' })
    streamToString.mockResolvedValue(mockFileContent)

    const events = await getEvents()

    expect(events[0].data).toEqual({ a: 'b' })
    expect(events[1].data).toEqual({ c: 1 })
  })
})
