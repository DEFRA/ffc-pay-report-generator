const { createSuppressedReport } = require('./suppressed/create')

const createReports = async () => {
  try {
    await createSuppressedReport()
  } catch (error) {
    console.error(`An error occurred while creating reports: ${error.message}`)
  }
}

module.exports = {
  createReports
}
