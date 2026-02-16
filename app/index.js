require('./insights').setup()
require('log-timestamp')
const { initialiseContainers } = require('./storage')
const { createReports } = require('./reports')

module.exports = (async () => {
  await initialiseContainers()
  await createReports()
})()
