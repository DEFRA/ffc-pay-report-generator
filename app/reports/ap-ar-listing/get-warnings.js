const { WARNING_EVENT } = require('../../constants/event-types')
const { getClient, odata } = require('../../storage')

const getWarnings = async (filter) => {
  const client = getClient(WARNING_EVENT)
  const eventResults = filter ? client.listEntities({ queryOptions: { filter, orderby: odata`time desc` } }) : client.listEntities({ queryOptions: { orderby: odata`time desc` } })
  const events = []
  for await (const event of eventResults) {
    event.data = JSON.parse(event.data)
    events.push(event)
  }
  return events
}

module.exports = {
  getWarnings
}
