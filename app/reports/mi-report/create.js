const { writeFile } = require('../../storage')
const { reportsConfig } = require('../../config')
const { getEvents } = require('./get-events')
const { groupEventsByCorrelationId } = require('./group-events-by-correlation-id')
const { orderGroupedEvents } = require('./order-grouped-events')
const { getReportLines } = require('./get-report-lines')
const { convertToCSV } = require('./convert-to-csv')
const { convertToBuffer } = require('./convert-to-buffer')

const USE_BUFFER = true

const createMIReport = async () => {
  const events = await getEvents()
  const groupedEvents = groupEventsByCorrelationId(events)
  const orderedEvents = orderGroupedEvents(groupedEvents)
  const reportLines = getReportLines(orderedEvents)
  if (reportLines.length) {
    if (USE_BUFFER) {
      const csvBuffer = convertToBuffer(reportLines)
      await writeFile(reportsConfig.miReportName, csvBuffer)
    } else {
      const csv = convertToCSV(reportLines)
      await writeFile(reportsConfig.miReportName, csv)
    }
    console.log(`MI report created: ${reportsConfig.miReportName}`)
  }
}

module.exports = {
  createMIReport
}
