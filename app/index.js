require('./insights').setup()
require('log-timestamp')
const { createMIReport } = require('./reports')
const { initialise } = require('./storage')

module.exports = (async () => {
  await initialise()
  await createMIReport()
})()
