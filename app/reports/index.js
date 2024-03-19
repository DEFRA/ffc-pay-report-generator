const { createAPARListingReport } = require('./ap-ar-listing/create')
const { createReportsWithSharedData } = require('./shared/create')
const { createSuppressedReport } = require('./suppressed/create')

const createReports = async () => {
  await createReportsWithSharedData()
  await createSuppressedReport()
  await createAPARListingReport()
}

module.exports = {
  createReports
}
