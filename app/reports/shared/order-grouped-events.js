const { getEventOrder } = require('./get-event-order')

const orderGroupedEvents = (events) => {
  return events.map(group => {
    const sortedEvents = group.events.sort((a, b) => {
      return getEventOrder(a.type) - getEventOrder(b.type)
    })
    return {
      correlationId: group.correlationId,
      events: sortedEvents
    }
  })
}

module.exports = {
  orderGroupedEvents
}
