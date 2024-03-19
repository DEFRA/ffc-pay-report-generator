const wreck = require('@hapi/wreck');
const config = require('./config')

const get = async (url, token) => {
  return wreck.get(`${config.paymentsEndpoint}${url}`, getConfiguration(token))
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