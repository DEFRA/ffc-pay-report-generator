require('./insights').setup()
require('log-timestamp')
const { initialise } = require('./storage')
const { createReports } = require('./reports')

module.exports = (async () => {
  await initialise()
  await createReports()
})()
