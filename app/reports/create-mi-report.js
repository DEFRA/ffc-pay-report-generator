const { MI_REPORT } = require('../constants/report-types')
const { createReport } = require('./report-processing/create-report')

const createMIReport = async () => {
  await createReport(MI_REPORT)
}

module.exports = {
  createMIReport
}
