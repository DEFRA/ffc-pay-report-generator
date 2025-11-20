const mockTableClient = { createTable: jest.fn() }
const mockContainerClient = { createIfNotExists: jest.fn() }
const mockBlobServiceClient = { getContainerClient: jest.fn().mockReturnValue(mockContainerClient) }

jest.mock('@azure/data-tables', () => {
  const TableClientConstructor = jest.fn(() => mockTableClient)
  TableClientConstructor.fromConnectionString = jest.fn().mockReturnValue(mockTableClient)
  return { TableClient: TableClientConstructor, odata: {} }
})

jest.mock('@azure/storage-blob', () => {
  const BlobServiceClientConstructor = jest.fn(() => mockBlobServiceClient)
  BlobServiceClientConstructor.fromConnectionString = jest.fn().mockReturnValue(mockBlobServiceClient)
  return { BlobServiceClient: BlobServiceClientConstructor }
})

const mockDefaultAzureCredential = jest.fn()
jest.mock('@azure/identity', () => ({
  DefaultAzureCredential: jest.fn().mockImplementation(() => mockDefaultAzureCredential)
}))

const config = require('../../app/config/storage')
const { PAYMENT_EVENT, BATCH_EVENT, HOLD_EVENT, WARNING_EVENT } = require('../../app/constants/event-types')
const { initialise, getClient } = require('../../app/storage')

describe('storage with managed identity', () => {
  let consoleSpy

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    jest.mock('../../app/config/storage', () => ({
      useConnectionString: false,
      managedIdentityClientId: 'test-client-id',
      account: 'testaccount',
      paymentTable: 'payments',
      holdTable: 'holds',
      warningTable: 'warnings',
      batchTable: 'batches',
      container: 'reports',
      createEntities: true
    }))
  })

  afterEach(() => consoleSpy.mockRestore())

  test('initialises with managed identity', async () => {
    const { initialise } = require('../../app/storage')
    const { DefaultAzureCredential } = require('@azure/identity')

    await initialise()

    expect(DefaultAzureCredential).toHaveBeenCalledWith({
      managedIdentityClientId: 'test-client-id'
    })
    expect(consoleSpy).toHaveBeenCalledWith(
      'Using DefaultAzureCredential with managed identity for Table Client'
    )
  })

  test('creates table clients with correct URLs', async () => {
    const { TableClient } = require('@azure/data-tables')
    const { initialise } = require('../../app/storage')

    await initialise()
    const expectedUrl = 'https://testaccount.table.core.windows.net'

    const tableNames = ['payments', 'holds', 'warnings', 'batches']
    tableNames.forEach((tableName, index) => {
      expect(TableClient).toHaveBeenNthCalledWith(index + 1, expectedUrl, tableName, expect.anything())
    })
  })
})

describe('storage', () => {
  let consoleSpy

  beforeEach(() => {
    jest.clearAllMocks()
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => consoleSpy.mockRestore())

  const tables = ['paymentTable', 'batchTable', 'holdTable', 'warningTable']

  tables.forEach((table) => {
    test(`should create ${table} when initialising`, async () => {
      await initialise()
      expect(mockTableClient.createTable).toHaveBeenCalledWith(config[table])
    })
  })

  test('should create each table once', async () => {
    await initialise()
    expect(mockTableClient.createTable).toHaveBeenCalledTimes(tables.length)
  })

  test('should create container once when initialising', async () => {
    await initialise()
    expect(mockContainerClient.createIfNotExists).toHaveBeenCalledTimes(1)
  })

  const eventClients = [
    [PAYMENT_EVENT, 'paymentClient'],
    [BATCH_EVENT, 'batchClient'],
    [HOLD_EVENT, 'holdClient'],
    [WARNING_EVENT, 'warningClient']
  ]

  eventClients.forEach(([eventType]) => {
    test(`getClient should return client for ${eventType}`, async () => {
      await initialise()
      const client = getClient(eventType)
      expect(client).toBeDefined()
    })
  })

  test('getClient should throw error for unknown event', async () => {
    await initialise()
    expect(() => getClient('unknown')).toThrow()
  })

  test('should log "Storage ready" once storage is initialised', async () => {
    await initialise()
    expect(consoleSpy).toHaveBeenCalledWith('Storage ready')
  })
})
