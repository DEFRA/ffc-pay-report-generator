const { REVENUE } = require('../../constants/cs-types')
const { getRevenue } = require('./get-revenue')

const getYear = (events) => {
  if (events[0].data.schemeId === 5 && getRevenue(events) === REVENUE) {
    const dueDate = new Date(events[0].data.dueDate)
    return dueDate.getFullYear()
  }
  return events[0].data.marketingYear
}

module.exports = {
  getYear
}
