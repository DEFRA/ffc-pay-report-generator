const { getReportLines } = require('../../../../app/reports/ap-ar-listing/get-report-lines')
const moment = require('moment')
const { DATE_FORMAT } = require('../../../../app/constants/date-format')

describe('getReportLines', () => {
  test('should transform events into report lines', () => {
    const events = [
      {
        batch: 'batch1',
        lastUpdated: new Date(),
        status: 'status1',
        frn: 'frn1',
        originalInvoiceNumber: 'invoice1',
        value: 100,
        invoiceNumber: 'invoice2',
        deltaAmount: 50,
        routedToRequestEditor: true,
        settledValue: 75,
        phError: 'error1',
        daxError: 'error2'
      }
    ]

    const expectedReportLines = [
      {
        Filename: 'batch1',
        'Date Time': moment(events[0].lastUpdated).format(DATE_FORMAT),
        Event: 'status1',
        FRN: 'frn1',
        'Invoice Number (Received in PH)': 'invoice1',
        'Invoice Value (Received in PH)': 100,
        'Invoice Number (Sent to D365)': 'invoice2',
        'Invoice Value (Sent to D365)': 50,
        'D365 Invoice Imported': true,
        'D365 Invoice Payment': 75,
        'PH Error Status': 'error1',
        'D365 Error Status': 'error2'
      }
    ]

    const reportLines = getReportLines(events)

    expect(reportLines).toEqual(expectedReportLines)
  })
})
