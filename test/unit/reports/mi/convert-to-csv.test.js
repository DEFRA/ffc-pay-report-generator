const { convertToCSV } = require('../../../../app/reports/convert-to-csv')

const reportLine = require('../../../mocks/report-lines/mi')
const reportLines = [reportLine, reportLine]

const createArrayFromCsv = (csv) => {
  return csv.split('\n').map(row => row.split(','))
}

describe('convert to csv', () => {
  test('adds id to header at position 1', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[0][0]).toMatch('id')
  })

  test('adds frn to header at position 2', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[0][1]).toMatch('frn')
  })

  test('adds claimNumber to header at position 3', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[0][2]).toMatch('claimNumber')
  })

  test('adds agreementNumber to header at position 4', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[0][3]).toMatch('agreementNumber')
  })

  test('adds schemeYear to header at position 5', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[0][4]).toMatch('schemeYear')
  })

  test('adds invoiceNumber to header at position 6', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[0][5]).toMatch('invoiceNumber')
  })

  test('adds preferredPaymentCurrency to header at position 7', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[0][6]).toMatch('preferredPaymentCurrency')
  })

  test('adds paymentInvoiceNumber to header at position 8', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[0][7]).toMatch('paymentInvoiceNumber')
  })

  test('adds totalAmount to header at position 9', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[0][8]).toMatch('totalAmount')
  })

  test('adds batchId to header at position 10', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[0][9]).toMatch('batchId')
  })

  test('adds batchCreatorId to header at position 11', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[0][10]).toMatch('batchCreatorId')
  })

  test('adds batchExportDate to header at position 12', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[0][11]).toMatch('batchExportDate')
  })

  test('adds status to header at position 13', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[0][12]).toMatch('status')
  })

  test('adds lastUpdated to header at position 14', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[0][13]).toMatch('lastUpdated')
  })

  test('adds id to data row at position 1', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[1][0]).toMatch(reportLines[0].id)
  })

  test('adds frn to data row at position 2', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[1][1]).toMatch(reportLines[0].frn.toString())
  })

  test('adds claimNumber to data row at position 3', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[1][2]).toMatch(reportLines[0].claimNumber)
  })

  test('adds agreementNumber to data row at position 4', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[1][3]).toMatch(reportLines[0].agreementNumber)
  })

  test('adds schemeYear to data row at position 5', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[1][4]).toMatch(reportLines[0].schemeYear.toString())
  })

  test('adds invoiceNumber to data row at position 6', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[1][5]).toMatch(reportLines[0].invoiceNumber)
  })

  test('adds preferredPaymentCurrency to data row at position 7', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[1][6]).toMatch(reportLines[0].preferredPaymentCurrency)
  })

  test('adds paymentInvoiceNumber to data row at position 8', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[1][7]).toMatch(reportLines[0].paymentInvoiceNumber.toString())
  })

  test('adds totalAmount to data row at position 9', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[1][8]).toMatch(reportLines[0].totalAmount.toString())
  })

  test('adds batchId to data row at position 10', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[1][9]).toMatch(reportLines[0].batchId)
  })

  test('adds batchCreatorId to data row at position 11', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[1][10]).toMatch(reportLines[0].batchCreatorId)
  })

  test('adds batchExportDate to data row at position 12', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[1][11]).toMatch(reportLines[0].batchExportDate)
  })

  test('adds status to data row at position 13', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[1][12]).toMatch(reportLines[0].status)
  })

  test('adds lastUpdated to data row at position 14', () => {
    const csv = convertToCSV(reportLines)
    const csvArray = createArrayFromCsv(csv)
    expect(csvArray[1][13]).toMatch(reportLines[0].lastUpdated)
  })
})
