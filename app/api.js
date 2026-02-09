const wreck = require('@hapi/wreck')

const get = async (url, token) => {
  return wreck.get(url, getConfiguration(token))
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
