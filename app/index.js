require('./insights').setup()
require('log-timestamp')
const { initialise } = require('./storage')
const { createMIReport } = require('./reports')
const { createSuppressedReport } = require('./reports')

module.exports = (async () => {
  await initialise()
  await createMIReport()
  await createSuppressedReport()
})()
