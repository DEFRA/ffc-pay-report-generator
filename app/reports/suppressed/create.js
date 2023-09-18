const { writeFile } = require('../../storage')
const { reportsConfig } = require('../../config')
const { getEvents } = require('./get-events')
const { getReportLines } = require('./get-report-lines')
const { convertToCSV } = require('../convert-to-csv')

const createSuppressedReport = async () => {
  const events = await getEvents()
  const reportLines = getReportLines(events)
  if (reportLines.length) {
    const csv = convertToCSV(reportLines)
    await writeFile(reportsConfig.suppressedReportName, csv)
    console.log(`Suppressed report created: ${reportsConfig.suppressedReportName}`)
  }
}

module.exports = {
  createSuppressedReport
}
