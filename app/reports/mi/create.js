const { writeFile } = require('../../storage')
const { reportsConfig } = require('../../config')
const { getEvents } = require('../shared/get-events')
const { groupEventsByCorrelationId } = require('../shared/group-events-by-correlation-id')
const { orderGroupedEvents } = require('../shared/order-grouped-events')
const { getReportLines } = require('./get-report-lines')
const { convertToCSV } = require('../convert-to-csv')

const createMIReport = async () => {
  const events = await getEvents()
  const groupedEvents = groupEventsByCorrelationId(events)
  const orderedEvents = orderGroupedEvents(groupedEvents)
  const reportLines = getReportLines(orderedEvents)
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
