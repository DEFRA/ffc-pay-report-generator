const { createMIReport } = require('./mi/create')
const { createSuppressedReport } = require('./suppressed/create')
const { createSummaryReport } = require('./summary/create')
const { createAPARListingReport } = require('./ap-ar-listing/create')

const createReports = async () => {
  await createMIReport()
  await createSuppressedReport()
  await createSummaryReport()
  await createAPARListingReport()
}

module.exports = {
  createReports
}
