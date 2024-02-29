const { writeFile } = require('../../storage')
const { reportsConfig } = require('../../config')
const { getEvents } = require('../shared/get-events')
const { groupEventsByCorrelationId } = require('../shared/group-events-by-correlation-id')
const { orderGroupedEvents } = require('../shared/order-grouped-events')
const { splitAPAREvents } = require('./split-ap-ar-events')
const { getReportLines } = require('./get-report-lines')
const { convertToCSV } = require('../convert-to-csv')
const { AR_REPORT, AP_REPORT } = require('../../constants/report-types')

const createAPARListingReport = async () => {
  const events = await getEvents()
  const groupedEvents = groupEventsByCorrelationId(events)
  const orderedEvents = orderGroupedEvents(groupedEvents)
  const { apEvents, arEvents } = splitAPAREvents(orderedEvents)
  if (apEvents.length) {
    const apReportLines = await getReportLines(apEvents)
    const csv = convertToCSV(apReportLines, AP_REPORT)
    await writeFile(reportsConfig.apListingReportName, csv)
    console.log(`AP listing report created: ${reportsConfig.apListingReportName}`)
  } else {
    console.log('AP listing report not created, no data')
  }
  if (arEvents.length) {
    const arReportLines = await getReportLines(arEvents, AR_REPORT)
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
