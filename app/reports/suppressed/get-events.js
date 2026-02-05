const wreck = require('@hapi/wreck')
const { reportsConfig } = require('../../config')
const { get } = require('../../api')
const { getDataRequestFile } = require('../../storage')

const getEvents = async () => {
  const url = '/suppressed-report-data'
  console.log(`${reportsConfig.eventHubEndpoint}${url}`)
  const { payload } = await get(`${reportsConfig.eventHubEndpoint}${url}`)
  const file = await getDataRequestFile(payload.file)
  const events = []
  if (payload && Array.isArray(payload)) {
    for (const event of payload) {
      if (typeof event.data === 'string') {
        event.data = JSON.parse(file)
      }
      events.push(event)
    }
  }
  
  return events
}

module.exports = {
  getEvents
}
