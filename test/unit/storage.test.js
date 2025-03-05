const mockTableClient = {
  createTable: jest.fn()
}

const mockContainerClient = {
  createIfNotExists: jest.fn()
}

const mockBlobServiceClient = {
  getContainerClient: jest.fn().mockReturnValue(mockContainerClient)
}

jest.mock('@azure/data-tables', () => {
  const TableClientConstructor = jest.fn(() => mockTableClient)
  TableClientConstructor.fromConnectionString = jest.fn().mockReturnValue(mockTableClient)

  return {
    TableClient: TableClientConstructor,
    odata: {}
  }
})

jest.mock('@azure/storage-blob', () => {
  const BlobServiceClientConstructor = jest.fn(() => mockBlobServiceClient)
  BlobServiceClientConstructor.fromConnectionString = jest.fn().mockReturnValue(mockBlobServiceClient)

  return {
    BlobServiceClient: BlobServiceClientConstructor
  }
})

const mockDefaultAzureCredential = jest.fn()
jest.mock('@azure/identity', () => ({
  DefaultAzureCredential: jest.fn().mockImplementation(() => mockDefaultAzureCredential)
}))

jest.mock('@azure/identity')

const config = require('../../app/config/storage')
const { PAYMENT_EVENT, BATCH_EVENT, HOLD_EVENT, WARNING_EVENT } = require('../../app/constants/event-types')

const { initialise, getClient } = require('../../app/storage')

describe('storage with managed identity', () => {
  let consoleSpy

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { })

    // Mock the storage config to use managed identity
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

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  test('initialises with managed identity', async () => {
    const { initialise } = require('../../app/storage')
    const { DefaultAzureCredential } = require('@azure/identity')

    await initialise()

    expect(DefaultAzureCredential).toHaveBeenCalledWith({
      managedIdentityClientId: 'test-client-id'
    })
    expect(consoleSpy).toHaveBeenCalledWith('Using DefaultAzureCredential with managed identity for Table Client')
  })

  test('creates table clients with correct URLs', async () => {
    const { TableClient } = require('@azure/data-tables')
    const { initialise } = require('../../app/storage')

    await initialise()

    const expectedUrl = 'https://testaccount.table.core.windows.net'
    expect(TableClient).toHaveBeenNthCalledWith(1, expectedUrl, 'payments', expect.anything())
    expect(TableClient).toHaveBeenNthCalledWith(2, expectedUrl, 'holds', expect.anything())
    expect(TableClient).toHaveBeenNthCalledWith(3, expectedUrl, 'warnings', expect.anything())
    expect(TableClient).toHaveBeenNthCalledWith(4, expectedUrl, 'batches', expect.anything())
  })
})

describe('storage', () => {
  let consoleSpy

  beforeEach(() => {
    jest.clearAllMocks()
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { })
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  test('should create payment table when initialising', async () => {
    await initialise()
    expect(mockTableClient.createTable).toHaveBeenCalledWith(config.paymentTable)
  })

  test('should create batches table when initialising', async () => {
    await initialise()
    expect(mockTableClient.createTable).toHaveBeenCalledWith(config.batchTable)
  })

  test('should create hold table when initialising', async () => {
    await initialise()
    expect(mockTableClient.createTable).toHaveBeenCalledWith(config.holdTable)
  })

  test('should create warning table when initialising', async () => {
    await initialise()
    expect(mockTableClient.createTable).toHaveBeenCalledWith(config.warningTable)
  })

  test('should create each table once', async () => {
    await initialise()
    expect(mockTableClient.createTable).toHaveBeenCalledTimes(4)
  })

  test('should create container when initialising', async () => {
    await initialise()
    expect(mockContainerClient.createIfNotExists).toHaveBeenCalled()
  })

  test('should create container once', async () => {
    await initialise()
    expect(mockContainerClient.createIfNotExists).toHaveBeenCalledTimes(1)
  })

  test('getClient should return payment client if payment event', async () => {
    await initialise()
    const client = getClient(PAYMENT_EVENT)
    expect(client).toBeDefined()
  })

  test('getClient should return batch client if batch event', async () => {
    await initialise()
    const client = getClient(BATCH_EVENT)
    expect(client).toBeDefined()
  })

  test('getClient should return hold client if hold event', async () => {
    await initialise()
    const client = getClient(HOLD_EVENT)
    expect(client).toBeDefined()
  })

  test('getClient should return warning client if warning event', async () => {
    await initialise()
    const client = getClient(WARNING_EVENT)
    expect(client).toBeDefined()
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
