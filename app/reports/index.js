const { createReportsWithSharedData } = require('./shared/create')
const { createSuppressedReport } = require('./suppressed/create')

const createReports = async () => {
  try {
    await createSuppressedReport()
    await createReportsWithSharedData()
  } catch (error) {
    console.error(`An error occurred while creating reports: ${error.message}`)
  }
}

module.exports = {
  createReports
}
