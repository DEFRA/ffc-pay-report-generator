const { reportsConfig } = require('../../config')
const { get } = require('../../api')
const { getDataRequestFile } = require('../../storage')
const { streamToString } = require('./stream-to-string')

const getEvents = async () => {
  const url = '/suppressed-report-data'
  console.log(`${reportsConfig.eventHubEndpoint}${url}`)

  const { payload } = await get(`${reportsConfig.eventHubEndpoint}${url}`)

  const fileResponse = await getDataRequestFile(payload.file)
  const fileContents = await streamToString(fileResponse.readableStreamBody)

  const parsedFile = JSON.parse(fileContents)

  const events = []

  if (Array.isArray(parsedFile)) {
    for (const event of parsedFile) {
      if (typeof event.data === 'string') {
        event.data = JSON.parse(event.data)
      }
      events.push(event)
    }
  }

  return events
}

module.exports = {
  getEvents,
}
