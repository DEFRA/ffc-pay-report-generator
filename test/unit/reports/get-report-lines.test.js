const { CORRELATION_ID } = require('../../mocks/values/correlation-id')

jest.mock('../../../app/reports/mi-report/get-frn')
const { getFrn: mockGetFrn } = require('../../../app/reports/mi-report/get-frn')

jest.mock('../../../app/reports/mi-report/get-invoice-number')
const { getInvoiceNumber: mockGetInvoiceNumber } = require('../../../app/reports/mi-report/get-invoice-number')

jest.mock('../../../app/reports/mi-report/get-currency')
const { getCurrency: mockGetCurrency } = require('../../../app/reports/mi-report/get-currency')

jest.mock('../../../app/reports/mi-report/get-value')
const { getValue: mockGetValue } = require('../../../app/reports/mi-report/get-value')

jest.mock('../../../app/reports/mi-report/get-batch-export-date')
const { getBatchExportDate: mockGetBatchExportDate } = require('../../../app/reports/mi-report/get-batch-export-date')

jest.mock('../../../app/reports/mi-report/get-status')
const { getStatus: mockGetStatus } = require('../../../app/reports/mi-report/get-status')

const enrichedEvent = require('../../mocks/events/enriched')
const extractedEvent = require('../../mocks/events/extracted')

const { getReportLines } = require('../../../app/reports/mi-report/get-report-lines')

let events

describe('get report lines', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    events = [{ correlationId: CORRELATION_ID, events: [enrichedEvent, extractedEvent] }]
  })

  test('should return array with line for all events', () => {
    const reportLines = getReportLines(events)
    expect(reportLines).toHaveLength(events.length)
  })
})
