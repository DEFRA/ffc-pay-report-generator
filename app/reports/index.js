const { createMIReport } = require('./mi/create')
const { createSuppressedReport } = require('./suppressed/create')

module.exports = {
  createMIReport,
  createSuppressedReport
}
