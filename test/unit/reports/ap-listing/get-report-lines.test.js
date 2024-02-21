jest.mock('../../../../app/reports/ap-listing/get-filename')
const { getFilename: mockGetFilename } = require('../../../../app/reports/ap-listing/get-filename')

jest.mock('../../../../app/reports/shared/get-status')
const { getStatus: mockGetStatus } = require('../../../../app/reports/shared/get-status')

jest.mock('../../../../app/reports/shared/get-frn')
const { getFrn: mockGetFrn } = require('../../../../app/reports/shared/get-frn')

jest.mock('../../../../app/reports/ap-listing/get-invoice-number')
const { getInvoiceNumber: mockGetInvoiceNumber } = require('../../../../app/reports/ap-listing/get-invoice-number')

jest.mock('../../../../app/reports/ap-listing/get-value')
const { getValue: mockGetValue } = require('../../../../app/reports/ap-listing/get-value')

jest.mock('../../../../app/reports/ap-listing/is-imported')
const { isImported: mockIsImported } = require('../../../../app/reports/ap-listing/is-imported')

jest.mock('../../../../app/reports/ap-listing/get-ph-error')
const { getPHError: mockGetPHError } = require('../../../../app/reports/ap-listing/get-ph-error')

jest.mock('../../../../app/reports/ap-listing/get-dax-error')
const { getDaxError: mockGetDaxError } = require('../../../../app/reports/ap-listing/get-dax-error')

const { FRN } = require('../../../mocks/values/frn')
const { UNKNOWN } = require('../../../../app/constants/unknown')
const { INVOICE_NUMBER } = require('../../../mocks/values/invoice-number')
const { VALUE } = require('../../../mocks/values/value')
const { DATE } = require('../../../mocks/values/date')
const { PAYMENT_ENRICHED_STATUS } = require('../../../../app/constants/statuses')
const { CORRELATION_ID } = require('../../../mocks/values/correlation-id')

const { getReportLines } = require('../../../../app/reports/ap-listing/get-report-lines')
const { FILENAME } = require('../../../mocks/values/filename')

let enrichedEvent
let events

describe('get report lines', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockGetFilename.mockReturnValue(FILENAME)
    mockGetFrn.mockReturnValue(FRN)
    mockGetInvoiceNumber.mockReturnValue(INVOICE_NUMBER)
    mockGetValue.mockReturnValue(VALUE)
    mockGetStatus.mockReturnValue(PAYMENT_ENRICHED_STATUS)
    mockIsImported.mockReturnValue('Y')
    mockGetPHError.mockReturnValue('An error')
    mockGetDaxError.mockReturnValue('Has occurred')

    enrichedEvent = JSON.parse(JSON.stringify(require('../../../mocks/events/enriched')))
    events = [{ correlationId: CORRELATION_ID, events: [enrichedEvent] }]
  })

  test('should return array with line for all events', () => {
    const reportLines = getReportLines(events)
    expect(reportLines).toHaveLength(events.length)
  })

  test('should return FileName as filename', () => {
    const reportLines = getReportLines(events)
    expect(reportLines[0].Filename).toEqual(FILENAME)
  })

  test('should return FileName as UNKNOWN if no filename returned', () => {
    mockGetFilename.mockReturnValue(null)
    const reportLines = getReportLines(events)
    expect(reportLines[0].Filename).toEqual(UNKNOWN)
  })

  test('should return date time', () => {
    const reportLines = getReportLines(events)
    expect(reportLines[0]['Date Time']).toEqual(DATE)
  })

  test('should return Event', () => {
    const reportLines = getReportLines(events)
    expect(reportLines[0].Event).toEqual(PAYMENT_ENRICHED_STATUS)
  })

  test('should return frn', () => {
    const reportLines = getReportLines(events)
    expect(reportLines[0].FRN).toEqual(FRN)
  })

  test('should return Invoice Number (Received in PH)', () => {
    const reportLines = getReportLines(events)
    expect(reportLines[0]['Invoice Number (Received in PH)']).toEqual(INVOICE_NUMBER)
  })

  test('should return Invoice Value (Received in PH)', () => {
    const reportLines = getReportLines(events)
    expect(reportLines[0]['Invoice Value (Received in PH)']).toEqual(VALUE)
  })

  test('should return Invoice Number (Sent to D365)', () => {
    const reportLines = getReportLines(events)
    expect(reportLines[0]['Invoice Number (Sent to D365)']).toEqual(INVOICE_NUMBER)
  })

  test('should return Invoice Value (Sent to D365)', () => {
    const reportLines = getReportLines(events)
    expect(reportLines[0]['Invoice Value (Sent to D365)']).toEqual(VALUE)
  })

  test('should return D365 Invoice Imported', () => {
    const reportLines = getReportLines(events)
    expect(reportLines[0]['D365 Invoice Imported']).toEqual('Y')
  })

  test('should return D365 Invoice Payment', () => {
    const reportLines = getReportLines(events)
    expect(reportLines[0]['D365 Invoice Payment']).toEqual(VALUE)
  })

  test('should return PH Error Status', () => {
    const reportLines = getReportLines(events)
    expect(reportLines[0]['PH Error Status']).toEqual('An error')
  })

  test('should return D365 Error Status', () => {
    const reportLines = getReportLines(events)
    expect(reportLines[0]['D365 Error Status']).toEqual('Has occurred')
  })
})
