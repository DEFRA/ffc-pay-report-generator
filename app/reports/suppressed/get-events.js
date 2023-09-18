const { PAYMENT_EVENT } = require('../../constants/event-types')
const { PAYMENT_SUPPRESSED } = require('../../constants/events')
const { getClient, odata } = require('../../storage')

const getEvents = async () => {
  const client = getClient(PAYMENT_EVENT)
  const eventResults = client.listEntities({ queryOptions: { filter: odata`category eq 'frn' and type eq '${PAYMENT_SUPPRESSED}'` } })
  const events = []
  for await (const event of eventResults) {
    event.data = JSON.parse(event.data)
    events.push(event)
  }
  return events
}

module.exports = {
  getEvents
}
