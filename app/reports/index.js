const { createMIReport } = require('./mi/create')
const { createSuppressedReport } = require('./suppressed/create')
const { createSummaryReport } = require('./summary/create')

const createReports = async () => {
  await createMIReport()
  await createSuppressedReport()
  await createSummaryReport()
}

module.exports = {
  createReports
}
