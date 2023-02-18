
const { DefaultAzureCredential } = require('@azure/identity')
const { TableClient, odata } = require('@azure/data-tables')
const { BlobServiceClient } = require('@azure/storage-blob')
const { storageConfig } = require('./config')
const { PAYMENT_EVENT, HOLD_EVENT, WARNING_EVENT, BATCH_EVENT } = require('./constants/event-types')

let paymentClient
let holdClient
let warningClient
let batchClient
let blobServiceClient
let container

const initialise = async () => {
  if (storageConfig.useConnectionString) {
    console.log('Using connection string for Table Client')
    paymentClient = TableClient.fromConnectionString(storageConfig.connectionString, storageConfig.paymentTable, { allowInsecureConnection: true })
    holdClient = TableClient.fromConnectionString(storageConfig.connectionString, storageConfig.holdTable, { allowInsecureConnection: true })
    warningClient = TableClient.fromConnectionString(storageConfig.connectionString, storageConfig.warningTable, { allowInsecureConnection: true })
    batchClient = TableClient.fromConnectionString(storageConfig.connectionString, storageConfig.batchTable, { allowInsecureConnection: true })
    blobServiceClient = BlobServiceClient.fromConnectionString(storageConfig.connectionString)
  } else {
    console.log('Using DefaultAzureCredential for Table Client')
    paymentClient = new TableClient(`https://${storageConfig.account}.table.core.windows.net`, storageConfig.paymentTable, new DefaultAzureCredential())
    holdClient = new TableClient(`https://${storageConfig.account}.table.core.windows.net`, storageConfig.holdTable, new DefaultAzureCredential())
    warningClient = new TableClient(`https://${storageConfig.account}.table.core.windows.net`, storageConfig.warningTable, new DefaultAzureCredential())
    batchClient = new TableClient(`https://${storageConfig.account}.table.core.windows.net`, storageConfig.batchTable, new DefaultAzureCredential())
    blobServiceClient = new BlobServiceClient(`https://${storageConfig.storageAccount}.blob.core.windows.net`, new DefaultAzureCredential())
  }
  container = blobServiceClient.getContainerClient(storageConfig.container)
  if (storageConfig.createEntities) {
    console.log('Making sure tables exist')
    await paymentClient.createTable(storageConfig.paymentTable)
    await holdClient.createTable(storageConfig.holdTable)
    await warningClient.createTable(storageConfig.warningTable)
    await batchClient.createTable(storageConfig.batchTable)
    console.log('Making sure blob containers exist')
    await container.createIfNotExists()
    console.log('Storage ready')
  }
}

const getClient = (eventType) => {
  switch (eventType) {
    case PAYMENT_EVENT:
      return paymentClient
    case HOLD_EVENT:
      return holdClient
    case WARNING_EVENT:
      return warningClient
    case BATCH_EVENT:
      return batchClient
    default:
      throw new Error(`Unknown event type: ${eventType}`)
  }
}

const writeFile = async (filename, content) => {
  const blob = container.getBlockBlobClient(filename)
  await blob.upload(content, content.length)
}

module.exports = {
  initialise,
  getClient,
  writeFile,
  odata
}
