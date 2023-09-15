const { writeFile } = require('../../storage')
const { reportsConfig } = require('../../config')
const { getEvents } = require('./get-events')
const { groupEventsByCorrelationId } = require('./group-events-by-correlation-id')
const { orderGroupedEvents } = require('./order-grouped-events')
const { getReportLines } = require('./get-report-lines')
const { convertToCSV } = require('./convert-to-csv')
const { SUPPRESSED_REPORT } = require('../../constants/report-types')
const { PAYMENT_SUPPRESSED } = require('../../constants/events')

const createReport = async (reportType) => {
  let events = await getEvents()
  if (reportType === SUPPRESSED_REPORT) {
    events = events.filter(event => event.type === PAYMENT_SUPPRESSED)
  }
  const groupedEvents = groupEventsByCorrelationId(events)
  const orderedEvents = orderGroupedEvents(groupedEvents)
  const reportLines = getReportLines(orderedEvents, reportType)
  if (reportLines.length) {
    const csv = convertToCSV(reportLines)
    await writeFile(reportsConfig.miReportName, csv)
    console.log(`MI report created: ${reportsConfig.miReportName}`)
  }
}

module.exports = {
  createReport
}
