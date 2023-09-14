const { writeFile } = require('../../storage')
const { reportsConfig } = require('../../config')
const { getEvents } = require('../shared/get-events')
const { getReportLines } = require('./get-report-lines')
const { convertToCSV } = require('../shared/convert-to-csv')
const { PAYMENT_SUPPRESSED } = require('../../constants/events')

const createSuppressedReport = async () => {
  const events = await getEvents()
  const filteredEvents = events.filter(event => event.type === PAYMENT_SUPPRESSED)
  const reportLines = getReportLines(filteredEvents)
  if (reportLines.length) {
    const csv = convertToCSV(reportLines)
    await writeFile(reportsConfig.suppressedReportName, csv)
    console.log(`Suppressed report created: ${reportsConfig.suppressedReportName}`)
  }
}

module.exports = {
  createSuppressedReport
}
