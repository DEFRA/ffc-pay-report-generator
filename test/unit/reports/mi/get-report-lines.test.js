jest.mock('../../../../app/reports/shared/get-frn')
const { getFrn: mockGetFrn } = require('../../../../app/reports/shared/get-frn')

jest.mock('../../../../app/reports/shared/get-invoice-number')
const { getInvoiceNumber: mockGetInvoiceNumber } = require('../../../../app/reports/shared/get-invoice-number')

jest.mock('../../../../app/reports/shared/get-currency')
const { getCurrency: mockGetCurrency } = require('../../../../app/reports/shared/get-currency')

jest.mock('../../../../app/reports/mi/get-value')
const { getValue: mockGetValue } = require('../../../../app/reports/mi/get-value')

jest.mock('../../../../app/reports/shared/get-batch-export-date')
const { getBatchExportDate: mockGetBatchExportDate } = require('../../../../app/reports/shared/get-batch-export-date')

jest.mock('../../../../app/reports/shared/get-status')
const { getStatus: mockGetStatus } = require('../../../../app/reports/shared/get-status')

const { TRANSACTION } = require('../../../../app/constants/transaction')
const { UNKNOWN } = require('../../../../app/constants/unknown')
const { PAYMENT_ENRICHED_STATUS } = require('../../../../app/constants/statuses')

const { FRN } = require('../../../mocks/values/frn')
const { INVOICE_NUMBER } = require('../../../mocks/values/invoice-number')
const { CURRENCY } = require('../../../mocks/values/currency')
const { VALUE } = require('../../../mocks/values/value')
const { DATE } = require('../../../mocks/values/date')
const { CORRELATION_ID } = require('../../../mocks/values/correlation-id')

const { getReportLines } = require('../../../../app/reports/mi/get-report-lines')

let enrichedEvent
let events

describe('get report lines', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockGetFrn.mockReturnValue(FRN)
    mockGetInvoiceNumber.mockReturnValue(INVOICE_NUMBER)
    mockGetCurrency.mockReturnValue(CURRENCY)
    mockGetValue.mockReturnValue(VALUE)
    mockGetBatchExportDate.mockReturnValue(DATE)
    mockGetStatus.mockReturnValue(PAYMENT_ENRICHED_STATUS)

    enrichedEvent = structuredClone(require('../../../mocks/events/enriched'))
    events = [{ correlationId: CORRELATION_ID, events: [enrichedEvent] }]
  })

  test('returns line for each event', () => {
    const lines = getReportLines(events)
    expect(lines).toHaveLength(events.length)
  })

  const fieldTests = [
    ['id', CORRELATION_ID],
    ['frn', FRN],
    ['claimNumber', () => enrichedEvent.data.contractNumber],
    ['agreementNumber', () => enrichedEvent.data.agreementNumber],
    ['schemeYear', () => enrichedEvent.data.marketingYear],
    ['invoiceNumber', INVOICE_NUMBER],
    ['preferredPaymentCurrency', CURRENCY],
    ['totalAmount', VALUE],
    ['batchId', () => enrichedEvent.data.batch],
    ['batchCreatorId', () => enrichedEvent.data.sourceSystem],
    ['batchExportDate', DATE],
    ['status', PAYMENT_ENRICHED_STATUS],
    ['lastUpdated', DATE]
  ]

  test.each(fieldTests)('returns %s', (field, expected) => {
    const lines = getReportLines(events)
    const value = typeof expected === 'function' ? expected() : expected
    expect(lines[0][field]).toEqual(value)
  })

  test('returns UNKNOWN when no contract number', () => {
    enrichedEvent.data.contractNumber = undefined
    const lines = getReportLines(events)
    expect(lines[0].claimNumber).toEqual(UNKNOWN)
  })

  test('returns TRANSACTION when batch missing', () => {
    enrichedEvent.data.batch = undefined
    const lines = getReportLines(events)
    expect(lines[0].batchId).toEqual(TRANSACTION)
  })
})
