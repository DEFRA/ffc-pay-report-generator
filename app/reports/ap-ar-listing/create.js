const { writeFile } = require('../../storage')
const { reportsConfig } = require('../../config')
const { getReportLines } = require('./get-report-lines')
const { convertToCSV } = require('../convert-to-csv')
const { get } = require('../../api')
const { sanitizeReports } = require('./sanitize-reports')

const createAPARListingReport = async () => {
  const { payload } = await get('/report-data')
  const payLoadData = payload.reportData
  const reportLines = getReportLines(payLoadData)
  const { apReportLines, arReportLines } = sanitizeReports(reportLines)
  if (apReportLines.length) {
    const csv = convertToCSV(apReportLines)
    await writeFile(reportsConfig.apListingReportName, csv)
    console.log(`AP listing report created: ${reportsConfig.apListingReportName}`)
  } else {
    console.log('AP listing report not created, no data')
  }
  if (arReportLines.length) {
    const csv = convertToCSV(arReportLines)
    await writeFile(reportsConfig.arListingReportName, csv)
    console.log(`AR listing report created: ${reportsConfig.arListingReportName}`)
  } else {
    console.log('AR listing report not created, no data')
  }
}

module.exports = {
  createAPARListingReport
}
