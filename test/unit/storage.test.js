jest.mock('@azure/storage-blob')
jest.mock('@azure/identity')

describe('storage', () => {
  let storage

  const mockUpload = jest.fn().mockResolvedValue({})
  const mockDownload = jest.fn().mockResolvedValue({ readableStreamBody: 'data' })
  const mockDelete = jest.fn().mockResolvedValue({})
  const mockGetProperties = jest.fn().mockResolvedValue({ contentLength: 100 })

  const mockBlockBlobClient = {
    upload: mockUpload,
    download: mockDownload,
    delete: mockDelete,
    getProperties: mockGetProperties
  }

  const mockReportContainer = {
    createIfNotExists: jest.fn().mockResolvedValue({}),
    getBlockBlobClient: jest.fn(() => mockBlockBlobClient)
  }

  const mockDataRequestContainer = {
    createIfNotExists: jest.fn().mockResolvedValue({}),
    getBlockBlobClient: jest.fn(() => mockBlockBlobClient)
  }

  const mockBlobServiceClient = {
    getContainerClient: jest.fn((containerName) => {
      if (containerName === 'reports') return mockReportContainer
      if (containerName === 'data-requests') return mockDataRequestContainer
      return null
    })
  }

  const mockStorageConfig = {
    useConnectionString: false,
    connectionString: 'UseDevelopmentStorage=true',
    createEntities: true,
    account: 'teststorageaccount',
    managedIdentityClientId: 'test-client-id',
    reportContainer: 'reports',
    dataRequestContainer: 'data-requests'
  }

  const setupMocks = () => {
    require('@azure/storage-blob').BlobServiceClient.fromConnectionString = jest
      .fn()
      .mockReturnValue(mockBlobServiceClient)

    require('@azure/storage-blob').BlobServiceClient.mockImplementation(() => mockBlobServiceClient)

    require('@azure/identity').DefaultAzureCredential.mockImplementation(() => ({}))
  }

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()

    mockReportContainer.createIfNotExists.mockClear()
    mockDataRequestContainer.createIfNotExists.mockClear()
    mockReportContainer.getBlockBlobClient.mockClear()
    mockDataRequestContainer.getBlockBlobClient.mockClear()
    mockBlobServiceClient.getContainerClient.mockClear()

    mockStorageConfig.useConnectionString = false
    mockStorageConfig.createEntities = true

    jest.doMock('../../app/config', () => ({
      storageConfig: mockStorageConfig
    }))

    setupMocks()

    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})

    storage = require('../../app/storage')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('initialisation', () => {
    test('uses connection string when config.useConnectionString is true', async () => {
      mockStorageConfig.useConnectionString = true
      jest.resetModules()

      jest.doMock('../../app/config', () => ({
        storageConfig: mockStorageConfig
      }))

      setupMocks()

      storage = require('../../app/storage')
      await storage.initialiseContainers()

      expect(require('@azure/storage-blob').BlobServiceClient.fromConnectionString)
        .toHaveBeenCalledWith(mockStorageConfig.connectionString)
      expect(console.log).toHaveBeenCalledWith('Using connection string for Blob Storage')
    })

    test('uses DefaultAzureCredential when config.useConnectionString is false', async () => {
      mockStorageConfig.useConnectionString = false
      jest.resetModules()

      jest.doMock('../../app/config', () => ({
        storageConfig: mockStorageConfig
      }))

      setupMocks()

      storage = require('../../app/storage')
      await storage.initialiseContainers()

      expect(require('@azure/identity').DefaultAzureCredential).toHaveBeenCalledWith({
        managedIdentityClientId: mockStorageConfig.managedIdentityClientId
      })

      expect(require('@azure/storage-blob').BlobServiceClient).toHaveBeenCalledWith(
        `https://${mockStorageConfig.account}.blob.core.windows.net`,
        expect.any(Object)
      )
      expect(console.log).toHaveBeenCalledWith('Using DefaultAzureCredential with managed identity for Blob Storage')
    })

    test('initialises containers when createEntities is true', async () => {
      mockStorageConfig.createEntities = true
      jest.resetModules()

      jest.doMock('../../app/config', () => ({
        storageConfig: mockStorageConfig
      }))

      setupMocks()

      storage = require('../../app/storage')
      await storage.initialiseContainers()

      expect(mockReportContainer.createIfNotExists).toHaveBeenCalled()
      expect(mockDataRequestContainer.createIfNotExists).toHaveBeenCalled()
      expect(console.log).toHaveBeenCalledWith('Making sure blob containers exist')
      expect(console.log).toHaveBeenCalledWith('Blob containers exist')
    })

    test('does not create containers when createEntities is false', async () => {
      mockStorageConfig.createEntities = false
      jest.resetModules()

      jest.doMock('../../app/config', () => ({
        storageConfig: mockStorageConfig
      }))

      setupMocks()

      storage = require('../../app/storage')
      await storage.initialiseContainers()

      expect(mockReportContainer.createIfNotExists).not.toHaveBeenCalled()
      expect(mockDataRequestContainer.createIfNotExists).not.toHaveBeenCalled()
    })

    test('does not reinitialise containers after first time', async () => {
      await storage.writeReportFile('first.json', 'content1')
      await storage.writeReportFile('second.json', 'content2')

      expect(mockReportContainer.createIfNotExists).toHaveBeenCalledTimes(1)
      expect(mockDataRequestContainer.createIfNotExists).toHaveBeenCalledTimes(1)
    })

    test('logs Storage ready after initialisation', async () => {
      await storage.initialiseContainers()
      expect(console.log).toHaveBeenCalledWith('Storage ready')
    })
  })

  describe('writeReportFile', () => {
    test('initialises containers before writing', async () => {
      await storage.writeReportFile('test.json', 'test content')

      expect(mockBlobServiceClient.getContainerClient).toHaveBeenCalledWith('reports')
    })

    test('uploads content to the report container', async () => {
      const filename = 'test-report.json'
      const content = 'test report content'

      await storage.writeReportFile(filename, content)

      expect(mockReportContainer.getBlockBlobClient).toHaveBeenCalledWith(filename)
      expect(mockBlockBlobClient.upload).toHaveBeenCalledWith(content, content.length)
    })

    test('returns the blob client', async () => {
      const result = await storage.writeReportFile('test.json', 'content')

      expect(result).toBe(mockBlockBlobClient)
    })

    test('throws error and handles upload failures', async () => {
      mockUpload.mockRejectedValueOnce(new Error('Upload failed'))

      await expect(storage.writeReportFile('badfile.json', 'content'))
        .rejects.toThrow('Upload failed')
    })
  })

  describe('getDataRequestFile', () => {
    beforeEach(async () => {
      await storage.initialiseContainers()
    })

    test('downloads file from data request container', async () => {
      const filename = 'data-request.json'

      const result = await storage.getDataRequestFile(filename)

      expect(mockDataRequestContainer.getBlockBlobClient).toHaveBeenCalledWith(filename)
      expect(mockBlockBlobClient.getProperties).toHaveBeenCalled()
      expect(mockBlockBlobClient.download).toHaveBeenCalled()
      expect(result).toEqual({ readableStreamBody: 'data' })
    })

    test('deletes file after download', async () => {
      await storage.getDataRequestFile('test.json')

      expect(mockBlockBlobClient.delete).toHaveBeenCalled()
    })

    test('deletes file even if download fails', async () => {
      mockDownload.mockRejectedValueOnce(new Error('Download failed'))

      await expect(storage.getDataRequestFile('test.json'))
        .rejects.toThrow('Download failed')

      expect(mockBlockBlobClient.delete).toHaveBeenCalled()
    })

    test('deletes file even when properties check throws', async () => {
      mockGetProperties.mockRejectedValueOnce(new Error('Properties failed'))

      await expect(storage.getDataRequestFile('test.json'))
        .rejects.toThrow('Properties failed')

      expect(mockBlockBlobClient.delete).toHaveBeenCalled()
    })

    test('accepts files with contentLength > 5', async () => {
      mockGetProperties.mockResolvedValueOnce({ contentLength: 6 })

      const result = await storage.getDataRequestFile('valid.json')

      expect(result).toEqual({ readableStreamBody: 'data' })
      expect(mockBlockBlobClient.download).toHaveBeenCalled()
    })
  })

  describe('integration scenarios', () => {
    test('handles multiple file operations sequentially', async () => {
      await storage.writeReportFile('report1.json', 'content1')
      await storage.writeReportFile('report2.json', 'content2')

      await storage.initialiseContainers()
      await storage.getDataRequestFile('data1.json')

      expect(mockBlockBlobClient.upload).toHaveBeenCalledTimes(2)
      expect(mockBlockBlobClient.download).toHaveBeenCalledTimes(1)
      expect(mockBlockBlobClient.delete).toHaveBeenCalledTimes(1)
    })

    test('maintains container initialization across operations', async () => {
      await storage.writeReportFile('report1.json', 'content1')
      await storage.initialiseContainers()
      await storage.getDataRequestFile('data1.json')
      await storage.writeReportFile('report2.json', 'content2')

      expect(mockReportContainer.createIfNotExists).toHaveBeenCalledTimes(1)
      expect(mockDataRequestContainer.createIfNotExists).toHaveBeenCalledTimes(1)
    })
  })
})
