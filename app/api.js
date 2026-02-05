const wreck = require('@hapi/wreck')
const { reportsConfig } = require('./config')

const get = async (url, token) => {
  return wreck.get(`${processingConfig.eventHubEndpoint}${url}`, getConfiguration(token))
}

const getConfiguration = (token) => {
  return {
    headers: {
      Authorization: token ?? ''
    },
    json: true
  }
}

module.exports = {
  get
}
