jest.mock('../../../../app/reports/report-processing/get-frn')
const { getFrn: mockGetFrn } = require('../../../../app/reports/report-processing/get-frn')

jest.mock('../../../../app/reports/report-processing/get-invoice-number')
const { getInvoiceNumber: mockGetInvoiceNumber } = require('../../../../app/reports/report-processing/get-invoice-number')

jest.mock('../../../../app/reports/report-processing/get-currency')
const { getCurrency: mockGetCurrency } = require('../../../../app/reports/report-processing/get-currency')

jest.mock('../../../../app/reports/report-processing/get-value')
const { getValue: mockGetValue } = require('../../../../app/reports/report-processing/get-value')

jest.mock('../../../../app/reports/report-processing/get-batch-export-date')
const { getBatchExportDate: mockGetBatchExportDate } = require('../../../../app/reports/report-processing/get-batch-export-date')

jest.mock('../../../../app/reports/report-processing/get-status')
const { getStatus: mockGetStatus } = require('../../../../app/reports/report-processing/get-status')

const { TRANSACTION } = require('../../../../app/constants/transaction')
const { FRN } = require('../../../mocks/values/frn')
const { UNKNOWN } = require('../../../../app/constants/unknown')
const { INVOICE_NUMBER } = require('../../../mocks/values/invoice-number')
const { CURRENCY } = require('../../../mocks/values/currency')
const { VALUE } = require('../../../mocks/values/value')
const { DATE } = require('../../../mocks/values/date')
const { PAYMENT_ENRICHED_STATUS, PAYMENT_SUPPRESSED_STATUS } = require('../../../../app/constants/statuses')
const { CORRELATION_ID } = require('../../../mocks/values/correlation-id')

const { getReportLines } = require('../../../../app/reports/report-processing/get-report-lines')
const { MI_REPORT, SUPPRESSED_REPORT } = require('../../../../app/constants/report-types')

let enrichedEvent
let events

describe('get report lines for MI', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockGetFrn.mockReturnValue(FRN)
    mockGetInvoiceNumber.mockReturnValue(INVOICE_NUMBER)
    mockGetCurrency.mockReturnValue(CURRENCY)
    mockGetValue.mockReturnValue(VALUE)
    mockGetBatchExportDate.mockReturnValue(DATE)
    mockGetStatus.mockReturnValue(PAYMENT_ENRICHED_STATUS)

    enrichedEvent = JSON.parse(JSON.stringify(require('../../../mocks/events/mi/enriched')))
    events = [{ correlationId: CORRELATION_ID, events: [enrichedEvent] }]
  })

  test('should return array with line for all events', () => {
    const reportLines = getReportLines(events, MI_REPORT)
    expect(reportLines).toHaveLength(events.length)
  })

  test('should return correlation id as id', () => {
    const reportLines = getReportLines(events, MI_REPORT)
    expect(reportLines[0].id).toEqual(CORRELATION_ID)
  })

  test('should return frn', () => {
    const reportLines = getReportLines(events, MI_REPORT)
    expect(reportLines[0].frn).toEqual(FRN)
  })

  test('should return contract number as claim number', () => {
    const reportLines = getReportLines(events, MI_REPORT)
    expect(reportLines[0].claimNumber).toEqual(enrichedEvent.data.contractNumber)
  })

  test('should return unknown if no contract number', () => {
    enrichedEvent.data.contractNumber = undefined
    const reportLines = getReportLines(events, MI_REPORT)
    expect(reportLines[0].claimNumber).toEqual(UNKNOWN)
  })

  test('should return agreement number', () => {
    const reportLines = getReportLines(events, MI_REPORT)
    expect(reportLines[0].agreementNumber).toEqual(enrichedEvent.data.agreementNumber)
  })

  test('should return marketing year as scheme year', () => {
    const reportLines = getReportLines(events, MI_REPORT)
    expect(reportLines[0].schemeYear).toEqual(enrichedEvent.data.marketingYear)
  })

  test('should return invoice number', () => {
    const reportLines = getReportLines(events, MI_REPORT)
    expect(reportLines[0].invoiceNumber).toEqual(INVOICE_NUMBER)
  })

  test('should return preferred payment currency', () => {
    const reportLines = getReportLines(events, MI_REPORT)
    expect(reportLines[0].preferredPaymentCurrency).toEqual(CURRENCY)
  })

  test('should return total amount', () => {
    const reportLines = getReportLines(events, MI_REPORT)
    expect(reportLines[0].totalAmount).toEqual(VALUE)
  })

  test('should return batch as batch id', () => {
    const reportLines = getReportLines(events, MI_REPORT)
    expect(reportLines[0].batchId).toEqual(enrichedEvent.data.batch)
  })

  test('should return transaction as batch id if no batch', () => {
    enrichedEvent.data.batch = undefined
    const reportLines = getReportLines(events, MI_REPORT)
    expect(reportLines[0].batchId).toEqual(TRANSACTION)
  })

  test('should return source system as batch creator id', () => {
    const reportLines = getReportLines(events, MI_REPORT)
    expect(reportLines[0].batchCreatorId).toEqual(enrichedEvent.data.sourceSystem)
  })

  test('should return batch export date', () => {
    const reportLines = getReportLines(events, MI_REPORT)
    expect(reportLines[0].batchExportDate).toEqual(DATE)
  })

  test('should return status', () => {
    const reportLines = getReportLines(events, MI_REPORT)
    expect(reportLines[0].status).toEqual(PAYMENT_ENRICHED_STATUS)
  })

  test('should return last updated', () => {
    const reportLines = getReportLines(events, MI_REPORT)
    expect(reportLines[0].lastUpdated).toEqual(DATE)
  })
})

describe('get report lines for suppressed', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockGetFrn.mockReturnValue(FRN)
    mockGetInvoiceNumber.mockReturnValue(INVOICE_NUMBER)
    mockGetCurrency.mockReturnValue(CURRENCY)
    mockGetValue.mockReturnValue(VALUE)
    mockGetBatchExportDate.mockReturnValue(DATE)
    mockGetStatus.mockReturnValue(PAYMENT_SUPPRESSED_STATUS)

    enrichedEvent = JSON.parse(JSON.stringify(require('../../../mocks/events/suppressed/enriched')))
    events = [{ correlationId: CORRELATION_ID, events: [enrichedEvent] }]
  })

  test('should return array with line for all events', () => {
    const reportLines = getReportLines(events, SUPPRESSED_REPORT)
    expect(reportLines).toHaveLength(events.length)
  })

  test('should return correlation id as id', () => {
    const reportLines = getReportLines(events, SUPPRESSED_REPORT)
    expect(reportLines[0].id).toEqual(CORRELATION_ID)
  })

  test('should return frn', () => {
    const reportLines = getReportLines(events, SUPPRESSED_REPORT)
    expect(reportLines[0].frn).toEqual(FRN)
  })

  test('should return agreement number', () => {
    const reportLines = getReportLines(events, SUPPRESSED_REPORT)
    expect(reportLines[0].agreementNumber).toEqual(enrichedEvent.data.agreementNumber)
  })

  test('should return delta value', () => {
    const reportLines = getReportLines(events, SUPPRESSED_REPORT)
    expect(reportLines[0].deltaValue).toEqual(enrichedEvent.data.deltaValue)
  })

  test('should return AP credit', () => {
    const reportLines = getReportLines(events, SUPPRESSED_REPORT)
    expect(reportLines[0].creditAP).toEqual(enrichedEvent.data.creditAP)
  })

  test('should return AR suppressed', () => {
    const reportLines = getReportLines(events, SUPPRESSED_REPORT)
    expect(reportLines[0].suppressedAR).toEqual(enrichedEvent.data.suppressedAR)
  })

  test('should return status', () => {
    const reportLines = getReportLines(events, SUPPRESSED_REPORT)
    expect(reportLines[0].status).toEqual(PAYMENT_SUPPRESSED_STATUS)
  })

  test('should return last updated', () => {
    const reportLines = getReportLines(events, SUPPRESSED_REPORT)
    expect(reportLines[0].lastUpdated).toEqual(DATE)
  })
})
