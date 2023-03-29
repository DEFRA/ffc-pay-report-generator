const config = require('../../app/config/storage')
const { PAYMENT_EVENT, BATCH_EVENT, HOLD_EVENT, WARNING_EVENT } = require('../../app/constants/event-types')

const mockTableClient = {
  createTable: jest.fn()
}
jest.mock('@azure/data-tables', () => {
  return {
    TableClient: {
      fromConnectionString: jest.fn().mockReturnValue(mockTableClient)
    }
  }
})
const mockContainerClient = {
  createIfNotExists: jest.fn()
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
jest.mock('@azure/identity')

const { initialise, getClient } = require('../../app/storage')

describe('storage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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

  test('getClient should return batch client if payment event', async () => {
    await initialise()
    const client = getClient(BATCH_EVENT)
    expect(client).toBeDefined()
  })

  test('getClient should return hold client if payment event', async () => {
    await initialise()
    const client = getClient(HOLD_EVENT)
    expect(client).toBeDefined()
  })

  test('getClient should return warning client if payment event', async () => {
    await initialise()
    const client = getClient(WARNING_EVENT)
    expect(client).toBeDefined()
  })

  test('getClient should throw error for unknown event', async () => {
    await initialise()
    expect(() => getClient('unknown')).toThrow()
  })
})
