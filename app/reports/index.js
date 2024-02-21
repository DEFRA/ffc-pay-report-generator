const { createMIReport } = require('./mi/create')
const { createSuppressedReport } = require('./suppressed/create')
const { createSummaryReport } = require('./summary/create')
const { createAPListingReport } = require('./ap-listing/create')

const createReports = async () => {
  await createMIReport()
  await createSuppressedReport()
  await createSummaryReport()
  await createAPListingReport()
}

module.exports = {
  createReports
}
