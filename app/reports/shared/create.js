const { getEvents } = require('../shared/get-events')
const { groupEventsByCorrelationId } = require('../shared/group-events-by-correlation-id')
const { orderGroupedEvents } = require('../shared/order-grouped-events')
const { createMIReport } = require('../mi')

const createReportsWithSharedData = async () => {
  const events = await getEvents()
  console.log(`Obtained events for shared data reports - ${events.length} report entries`)
  const groupedEvents = groupEventsByCorrelationId(events)
  const orderedEvents = orderGroupedEvents(groupedEvents)
  await createMIReport(orderedEvents)
}

module.exports = {
  createReportsWithSharedData
}
