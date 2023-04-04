const { BlobServiceClient } = require('@azure/storage-blob')
const { storageConfig } = require('../../app/config')

const blobServiceClient = BlobServiceClient.fromConnectionString(storageConfig.connectionString)
const container = blobServiceClient.getContainerClient(storageConfig.container)

const getBlob = async (filename) => {
  const blob = container.getBlockBlobClient(filename)
  return (await blob.downloadToBuffer()).toString()
}

module.exports = {
  getBlob
}
