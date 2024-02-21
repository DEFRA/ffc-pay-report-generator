const { WARNING_EVENT } = require('../../constants/event-types')
const { getClient, odata } = require('../../storage')

const getWarning = async (filter) => {
  const client = getClient(WARNING_EVENT)
  const [event] = await client.listEntities({ queryOptions: { filter, orderby: odata`time desc`, top: 1 } })
  if (!event) {
    return null
  }
  event.data = JSON.parse(event.data)
  return event
}

module.exports = {
  getWarning
}
