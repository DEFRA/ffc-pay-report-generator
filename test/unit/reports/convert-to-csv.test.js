const { convertToCSV } = require('../../../app/reports/convert-to-csv')

const reportLine = require('../../mocks/report-lines/mi')
const reportLines = [reportLine, reportLine]

const createArrayFromCsv = (csv) => {
  return csv.split('\n')
    .map(r => r.split(',').map(cell => cell.replace(/^"|"$/g, '')))
}

const headerMap = [
  'id',
  'frn',
  'claimNumber',
  'agreementNumber',
  'schemeYear',
  'invoiceNumber',
  'preferredPaymentCurrency',
  'paymentInvoiceNumber',
  'totalAmount',
  'batchId',
  'batchCreatorId',
  'batchExportDate',
  'status',
  'lastUpdated'
]

describe('convert to csv', () => {
  const mappedHeaders = headerMap.map((h, i) => [h, i])

  test.each(mappedHeaders)('adds %s to header at position %i', (header, index) => {
    const csvArray = createArrayFromCsv(convertToCSV(reportLines))
    expect(csvArray[0][index]).toBe(header)
  }
  )

  test.each(mappedHeaders)('adds %s to data row at position %i', (header, index) => {
    const csvArray = createArrayFromCsv(convertToCSV(reportLines))
    const value = reportLines[0][header]
    expect(csvArray[1][index]).toBe(value.toString())
  }
  )
})
