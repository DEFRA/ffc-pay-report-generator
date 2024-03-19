const moment = require('moment')
const { DATE_FORMAT } = require('../../constants/date-format')

const getReportLines = async (events) => {
  const reportLines = events.map((event) => {
    return {
      Filename: event.batch,
      'Date Time': moment(event.lastUpdated).format(DATE_FORMAT),
      Event: event.status,
      FRN: event.frn,
      'Invoice Number (Received in PH)': event.originalInvoiceNumber,
      'Invoice Value (Received in PH)': event.value,
      'Invoice Number (Sent to D365)': event.invoiceNumber,
      'Invoice Value (Sent to D365)': event.deltaAmount,
      'D365 Invoice Imported': event.routedToRequestEditor,
      'D365 Invoice Payment': event.settledValue,
      'PH Error Status': event.phError,
      'D365 Error Status': event.daxError
    }
  })
  return reportLines
}

module.exports = {
  getReportLines
}
