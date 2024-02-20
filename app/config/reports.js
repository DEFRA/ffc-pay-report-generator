const Joi = require('joi')

const schema = Joi.object({
  miReportName: Joi.string().default('ffc-pay-mi-report-v2.csv'),
  suppressedReportName: Joi.string().default('ffc-pay-suppressed-report.csv'),
  summaryReportName: Joi.string().default('ffc-pay-combined-transaction-report.csv')
})

const config = {
  miReportName: process.env.MI_REPORT_NAME,
  suppressedReportName: process.env.SUPPRESSED_REPORT_NAME,
  summaryReportName: process.env.SUMMARY_REPORT_NAME
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The report config is invalid. ${result.error.message}`)
}

module.exports = result.value
