const { DefaultAzureCredential } = require('@azure/identity')
const { BlobServiceClient } = require('@azure/storage-blob')
const { storageConfig } = require('./config')

let blobServiceClient, reportContainer, dataRequestContainer
let containersInitialised = false
const EMPTY_CONTENT_LENGTH = 5

const getCredential = () =>
  new DefaultAzureCredential({
    managedIdentityClientId: storageConfig.managedIdentityClientId
  })

const createBlobServiceClient = () => {
  if (storageConfig.useConnectionString) {
    console.log('Using connection string for Blob Storage')
    return BlobServiceClient.fromConnectionString(
      storageConfig.connectionString
    )
  }

  console.log(
    'Using DefaultAzureCredential with managed identity for Blob Storage'
  )
  return new BlobServiceClient(
    `https://${storageConfig.account}.blob.core.windows.net`,
    getCredential()
  )
}

const initialiseContainers = async () => {
  if (containersInitialised) {
    return
  }

  blobServiceClient = createBlobServiceClient()

  reportContainer = blobServiceClient.getContainerClient(
    storageConfig.reportContainer
  )
  dataRequestContainer = blobServiceClient.getContainerClient(
    storageConfig.dataRequestContainer
  )

  if (storageConfig.createEntities) {
    console.log('Making sure blob containers exist')

    await Promise.all([
      reportContainer.createIfNotExists(),
      dataRequestContainer.createIfNotExists()
    ])

    console.log('Blob containers exist')
  }

  containersInitialised = true
  console.log('Storage ready')
}

const writeReportFile = async (filename, content) => {
  await initialiseContainers()

  const blob = reportContainer.getBlockBlobClient(filename)
  await blob.upload(content, content.length)
  return blob
}

const getDataRequestFile = async (filename) => {
  const blob = dataRequestContainer.getBlockBlobClient(filename)

  try {
    const properties = await blob.getProperties()

    if (properties.contentLength <= EMPTY_CONTENT_LENGTH) {
      console.warn(`File ${filename} is empty.`)
      throw new Error(
        'No data was found for the selected report criteria. Please review your filters, such as date range or report type, and try again.'
      )
    }
    return await blob.download()
  } finally {
    await blob.delete()
  }
}

module.exports = {
  initialiseContainers,
  writeReportFile,
  getDataRequestFile
}
