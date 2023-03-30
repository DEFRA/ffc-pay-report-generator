const extractedEvent = require('../../mocks/events/extracted')
const enrichedEvent = require('../../mocks/events/enriched')

const { getInvoiceNumber } = require('../../../app/reports/mi-report/get-invoice-number')

const events = [extractedEvent, enrichedEvent]

describe('get invoice number', () => {
  test('should return the invoice number from the enriched event', () => {
    const invoiceNumber = getInvoiceNumber(events)
    expect(invoiceNumber).toEqual(enrichedEvent.data.invoiceNumber)
  })

  test('should return first event invoice number if no enriched event is found', () => {
    const invoiceNumber = getInvoiceNumber([extractedEvent])
    expect(invoiceNumber).toEqual(extractedEvent.data.invoiceNumber)
  })

  test('should return unknown if no events', () => {
    const invoiceNumber = getInvoiceNumber([])
    expect(invoiceNumber).toEqual('Unknown')
  })
})
