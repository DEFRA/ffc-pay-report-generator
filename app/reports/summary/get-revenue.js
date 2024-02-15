const { REVENUE, CAPITAL } = require('../../constants/cs-types')

const getRevenue = (events) => {
  if (events[0].data.schemeId === 5) {
    // separate out date to avoid Americanisation
    const dateParts = events[0].data.dueDate.split('/')
    const day = parseInt(dateParts[0], 10)
    const month = parseInt(dateParts[1], 10) - 1
    const year = parseInt(dateParts[2], 10)
    const dueDate = new Date(year, month, day)

    // depending on the due date we know if it is revenue
    const is01December = dueDate.getDate() === 1 && dueDate.getMonth() === 11
    const is01January2016 = dueDate.getDate() === 1 && dueDate.getMonth() === 0 && dueDate.getFullYear() === 2016
    if (is01December || is01January2016) {
      return REVENUE
    }
    return CAPITAL
  }
  return null
}

module.exports = {
  getRevenue
}
