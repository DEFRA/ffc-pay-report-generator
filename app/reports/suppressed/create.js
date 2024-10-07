const { writeFile } = require('../../storage')
const { reportsConfig } = require('../../config')
const { getEvents } = require('./get-events')
const { getReportLines } = require('./get-report-lines')
const { convertToCSV } = require('../convert-to-csv')

const createSuppressedReport = async () => {
  const events = await getEvents()
  console.log(`Obtained events for suppressed reports - ${events.length} report entries`)
  const reportLines = getReportLines(events)
  if (reportLines.length) {
    const csv = convertToCSV(reportLines)
    await writeFile(reportsConfig.suppressedReportName, csv)
    console.log(`Suppressed report created: ${reportsConfig.suppressedReportName}`)
  } else {
    console.log('Suppressed report not created, no data')
  }
}

module.exports = {
  createSuppressedReport
}
