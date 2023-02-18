const { queryEntitiesByTimestamp, writeFile, connect } = require('./storage')
const buildReport = require('./mi-report')
const { reportName } = require('./config')

const main = async () => {
  connect()
  console.log('Sourcing report data')
  const events = await queryEntitiesByTimestamp()
  if (events.length) {
    console.log('Report creation started')
    const csvData = buildReport(events)
    await writeFile(reportName, csvData)
    console.log('Report created')
  }
}

main()
