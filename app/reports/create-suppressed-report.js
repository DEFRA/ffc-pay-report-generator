const { SUPPRESSED_REPORT } = require('../constants/report-types')
const { createReport } = require('./report-processing/create-report')

const createSuppressedReport = async () => {
  await createReport(SUPPRESSED_REPORT)
}

module.exports = {
  createSuppressedReport
}
