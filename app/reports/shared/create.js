const { getEvents } = require('../shared/get-events')
const { groupEventsByCorrelationId } = require('../shared/group-events-by-correlation-id')
const { orderGroupedEvents } = require('../shared/order-grouped-events')
const { createMIReport } = require('../mi')
const { createAPARListingReport } = require('../ap-ar-listing/create')
const { createSummaryReport } = require('../summary/create')

const createReportsWithSharedData = async () => {
  const events = await getEvents()
  const groupedEvents = groupEventsByCorrelationId(events)
  const orderedEvents = orderGroupedEvents(groupedEvents)
  createMIReport(orderedEvents)
  createAPARListingReport(orderedEvents)
  createSummaryReport(orderedEvents)
}

module.exports = {
  createReportsWithSharedData
}
