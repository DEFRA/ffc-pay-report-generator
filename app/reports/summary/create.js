const { writeFile } = require('../../storage')
const { reportsConfig } = require('../../config')
const { getReportLines } = require('./get-report-lines')
const { convertToCSV } = require('../convert-to-csv')

const createSummaryReport = async (events) => {
  const reportLines = await getReportLines(events)
  if (reportLines.length) {
    const csv = convertToCSV(reportLines)
    await writeFile(reportsConfig.summaryReportName, csv)
    console.log(`Combined transaction report created: ${reportsConfig.summaryReportName}`)
  } else {
    console.log('Combined transaction report not created, no data')
  }
}

module.exports = {
  createSummaryReport
}
