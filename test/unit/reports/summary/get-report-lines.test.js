jest.mock('../../../../app/reports/summary/get-transaction-status')
const { getTransactionStatus: mockGetTransactionStatus } = require('../../../../app/reports/summary/get-transaction-status')

jest.mock('../../../../app/reports/shared/get-frn')
const { getFrn: mockGetFrn } = require('../../../../app/reports/shared/get-frn')

jest.mock('../../../../app/reports/summary/get-revenue')
const { getRevenue: mockGetRevenue } = require('../../../../app/reports/summary/get-revenue')

jest.mock('../../../../app/reports/summary/get-year')
const { getYear: mockGetYear } = require('../../../../app/reports/summary/get-year')

jest.mock('../../../../app/reports/shared/get-invoice-number')
const { getInvoiceNumber: mockGetInvoiceNumber } = require('../../../../app/reports/shared/get-invoice-number')

jest.mock('../../../../app/reports/shared/get-currency')
const { getCurrency: mockGetCurrency } = require('../../../../app/reports/shared/get-currency')

jest.mock('../../../../app/reports/summary/get-claim-amount')
const { getClaimAmount: mockGetClaimAmount } = require('../../../../app/reports/summary/get-claim-amount')

jest.mock('../../../../app/reports/shared/get-batch-export-date')
const { getBatchExportDate: mockGetBatchExportDate } = require('../../../../app/reports/shared/get-batch-export-date')

jest.mock('../../../../app/reports/summary/get-delta-amount')
const { getDeltaAmount: mockGetDeltaAmount } = require('../../../../app/reports/summary/get-delta-amount')

jest.mock('../../../../app/reports/summary/routed-to-request-editor')
const { routedToRequestEditor: mockRoutedToRequestEditor } = require('../../../../app/reports/summary/routed-to-request-editor')

jest.mock('../../../../app/reports/summary/get-ap-amount')
const { getAPAmount: mockGetAPAmount } = require('../../../../app/reports/summary/get-ap-amount')

jest.mock('../../../../app/reports/summary/get-ar-amount')
const { getARAmount: mockGetARAmount } = require('../../../../app/reports/summary/get-ar-amount')

jest.mock('../../../../app/reports/summary/get-debt-type')
const { getDebtType: mockGetDebtType } = require('../../../../app/reports/summary/get-debt-type')

const { TRANSACTION } = require('../../../../app/constants/transaction')
const { FRN } = require('../../../mocks/values/frn')
const { UNKNOWN } = require('../../../../app/constants/unknown')
const { INVOICE_NUMBER } = require('../../../mocks/values/invoice-number')
const { CURRENCY } = require('../../../mocks/values/currency')
const { VALUE } = require('../../../mocks/values/value')
const { DATE } = require('../../../mocks/values/date')
const { PAYMENT_PROCESSED_STATUS } = require('../../../../app/constants/statuses')
const { CORRELATION_ID } = require('../../../mocks/values/correlation-id')
const { YEAR } = require('../../../mocks/values/year')

const { getReportLines } = require('../../../../app/reports/summary/get-report-lines')
const { DELTA_VALUE } = require('../../../mocks/values/delta-value')
const { ROUTED } = require('../../../mocks/values/routed')
const { AP } = require('../../../mocks/values/ap')
const { AR } = require('../../../mocks/values/ar')
const { ADMIN_IRREGULAR } = require('../../../mocks/values/admin-irregular')
const { REVENUE, CAPITAL } = require('../../../mocks/values/revenue')

let processedEvent
let events

describe('get report lines', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockGetTransactionStatus.mockReturnValue(PAYMENT_PROCESSED_STATUS)
    mockGetFrn.mockReturnValue(FRN)
    mockGetRevenue.mockReturnValue(REVENUE)
    mockGetYear.mockReturnValue(YEAR)
    mockGetInvoiceNumber.mockReturnValue(INVOICE_NUMBER)
    mockGetCurrency.mockReturnValue(CURRENCY)
    mockGetClaimAmount.mockReturnValue(VALUE)
    mockGetBatchExportDate.mockReturnValue(DATE)
    mockGetDeltaAmount.mockReturnValue(DELTA_VALUE)
    mockRoutedToRequestEditor.mockReturnValue(ROUTED)
    mockGetAPAmount.mockReturnValue(AP)
    mockGetARAmount.mockReturnValue(AR)
    mockGetDebtType.mockReturnValue(ADMIN_IRREGULAR)

    processedEvent = JSON.parse(JSON.stringify(require('../../../mocks/events/processed')))
    events = [{ correlationId: CORRELATION_ID, events: [processedEvent] }]
  })

  test('should return array with line for all events', async () => {
    const reportLines = await getReportLines(events)
    expect(reportLines).toHaveLength(events.length)
  })

  test('should return correlation id as ID', async () => {
    const reportLines = await getReportLines(events)
    expect(reportLines[0].ID).toEqual(CORRELATION_ID)
  })

  test('should return frn', async () => {
    const reportLines = await getReportLines(events)
    expect(reportLines[0].FRN).toEqual(FRN)
  })

  test('should return contract number as claim ID', async () => {
    const reportLines = await getReportLines(events)
    expect(reportLines[0]['Claim ID']).toEqual(processedEvent.data.contractNumber)
  })

  test('should return unknown if no contract number', async () => {
    processedEvent.data.contractNumber = undefined
    const reportLines = await getReportLines(events)
    expect(reportLines[0]['Claim ID']).toEqual(UNKNOWN)
  })

  test('should return agreement number', async () => {
    const reportLines = await getReportLines(events)
    expect(reportLines[0]['Agreement Number']).toEqual(processedEvent.data.agreementNumber)
  })

  test('should return revenue', async () => {
    const reportLines = await getReportLines(events)
    expect(reportLines[0]['Revenue / Capital']).toEqual(REVENUE)
  })

  test('should return revenue as Capital if function returns capital', async () => {
    mockGetRevenue.mockReturnValue(CAPITAL)
    const reportLines = await getReportLines(events)
    expect(reportLines[0]['Revenue / Capital']).toEqual(CAPITAL)
  })

  test('should return revenue as null if function returns null', async () => {
    mockGetRevenue.mockReturnValue(null)
    const reportLines = await getReportLines(events)
    expect(reportLines[0]['Revenue / Capital']).toEqual(null)
  })

  test('should return output of getYear as year', async () => {
    const reportLines = await getReportLines(events)
    expect(reportLines[0].Year).toEqual(YEAR)
  })

  test('should return invoice number', async () => {
    const reportLines = await getReportLines(events)
    expect(reportLines[0]['Invoice Number']).toEqual(INVOICE_NUMBER)
  })

  test('should return payment currency', async () => {
    const reportLines = await getReportLines(events)
    expect(reportLines[0]['Payment Currency']).toEqual(CURRENCY)
  })

  test('should return payment request number', async () => {
    const reportLines = await getReportLines(events)
    expect(reportLines[0]['Payment Request Number']).toEqual(processedEvent.data.paymentRequestNumber)
  })

  test('should return full claim amount', async () => {
    const reportLines = await getReportLines(events)
    expect(reportLines[0]['Full Claim Amount']).toEqual(VALUE)
  })

  test('should return full claim amount as UNKNOWN if returns null', async () => {
    mockGetClaimAmount.mockReturnValue(null)
    const reportLines = await getReportLines(events)
    expect(reportLines[0]['Full Claim Amount']).toEqual(UNKNOWN)
  })

  test('should return batch as batch id', async () => {
    const reportLines = await getReportLines(events)
    expect(reportLines[0]['Batch ID']).toEqual(processedEvent.data.batch)
  })

  test('should return transaction as batch id if no batch', async () => {
    processedEvent.data.batch = undefined
    const reportLines = await getReportLines(events)
    expect(reportLines[0]['Batch ID']).toEqual(TRANSACTION)
  })

  test('should return source system as batch creator id', async () => {
    const reportLines = await getReportLines(events)
    expect(reportLines[0]['Batch Creator ID']).toEqual(processedEvent.data.sourceSystem)
  })

  test('should return batch export date', async () => {
    const reportLines = await getReportLines(events)
    expect(reportLines[0]['Batch Export Date']).toEqual(DATE)
  })

  test('should return if routed to request editor', async () => {
    const reportLines = await getReportLines(events)
    expect(reportLines[0]['Routed To Request Editor']).toEqual(ROUTED)
  })

  test('should return delta amount', async () => {
    const reportLines = await getReportLines(events)
    expect(reportLines[0]['Delta Amount']).toEqual(DELTA_VALUE)
  })

  test('should return delta amount as unknown if returned value is null', async () => {
    mockGetDeltaAmount.mockReturnValue(null)
    const reportLines = await getReportLines(events)
    expect(reportLines[0]['Delta Amount']).toEqual(UNKNOWN)
  })

  test('should return AP amount', async () => {
    const reportLines = await getReportLines(events)
    expect(reportLines[0]['AP Amount']).toEqual(AP)
  })

  test('should return AP amount as unknown if returned value is null', async () => {
    mockGetAPAmount.mockReturnValue(null)
    const reportLines = await getReportLines(events)
    expect(reportLines[0]['AP Amount']).toEqual(UNKNOWN)
  })

  test('should return AR amount', async () => {
    const reportLines = await getReportLines(events)
    expect(reportLines[0]['AR Amount']).toEqual(AR)
  })

  test('should return AR amount as unknown if returned value is null', async () => {
    mockGetARAmount.mockReturnValue(null)
    const reportLines = await getReportLines(events)
    expect(reportLines[0]['AR Amount']).toEqual(UNKNOWN)
  })

  test('should return status', async () => {
    const reportLines = await getReportLines(events)
    expect(reportLines[0].Status).toEqual(PAYMENT_PROCESSED_STATUS)
  })

  test('should return last updated', async () => {
    const reportLines = await getReportLines(events)
    expect(reportLines[0]['Last Updated']).toEqual(DATE)
  })
})
