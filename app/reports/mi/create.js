const { writeFile } = require('../../storage')
const { reportsConfig } = require('../../config')
const { getReportLines } = require('./get-report-lines')
const { convertToCSV } = require('../convert-to-csv')

const createMIReport = async (events) => {
  const reportLines = getReportLines(events)
  if (reportLines.length) {
    const csv = convertToCSV(reportLines)
    await writeFile(reportsConfig.miReportName, csv)
    console.log(`MI report created: ${reportsConfig.miReportName}`)
  } else {
    console.log('MI report not created, no data')
  }
}

module.exports = {
  createMIReport
}
