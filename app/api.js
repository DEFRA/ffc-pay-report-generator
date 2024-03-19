const wreck = require('@hapi/wreck')
const { storageConfig } = require('./config')

const get = async (url, token) => {
  return wreck.get(`${storageConfig.paymentsEndpoint}${url}`, getConfiguration(token))
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
