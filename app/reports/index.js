const { createReportsWithSharedData } = require('./shared/create')
const { createSuppressedReport } = require('./suppressed/create')

const createReports = async () => {
  await createReportsWithSharedData()
  await createSuppressedReport()
}

module.exports = {
  createReports
}
