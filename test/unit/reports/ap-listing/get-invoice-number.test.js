const extractedEvent = require('../../../mocks/events/extracted')
const enrichedEvent = require('../../../mocks/events/enriched')
const submittedEvent = require('../../../mocks/events/submitted')
const { PAYMENT_ENRICHED, PAYMENT_EXTRACTED } = require('../../../../app/constants/events')
const { getInvoiceNumber } = require('../../../../app/reports/ap-listing/get-invoice-number')
const { UNKNOWN } = require('../../../../app/constants/unknown')

let events

describe('get invoice number', () => {
  beforeEach(() => {
    events = []
  })

  test('should return invoice number if enriched event exist and enriched type provided', () => {
    events = [extractedEvent, enrichedEvent]
    const value = getInvoiceNumber(events, PAYMENT_ENRICHED)
    expect(value).toEqual(enrichedEvent.data.invoiceNumber)
  })

  test('should return invoice number if extracted type provided', () => {
    events = [extractedEvent]
    const value = getInvoiceNumber(events, PAYMENT_EXTRACTED)
    expect(value).toEqual(extractedEvent.data.invoiceNumber)
  })

  test('should return UNKNOWN if type of event does not exist', () => {
    events = [submittedEvent]
    const value = getInvoiceNumber(events, PAYMENT_ENRICHED)
    expect(value).toEqual(UNKNOWN)
  })
})
