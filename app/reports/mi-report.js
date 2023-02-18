const { PAYMENT_EVENT } = require('../constants/event-types')
const { getClient, odata } = require('../storage')

const createMIReport = async () => {
  const events = await getEvents()
  console.log(events)

  // return {
  //   id,
  //   frn: paymentData.frn,
  //   claimNumber: paymentData.contractNumber,
  //   agreementNumber: paymentData.agreementNumber,
  //   schemeYear: paymentData.marketingYear,
  //   invoiceNumber: paymentData.invoiceNumber,
  //   preferredPaymentCurrency: paymentData.currency,
  //   paymentInvoiceNumber: paymentData.paymentRequestNumber,
  //   totalAmount: paymentData.value,
  //   batchId: sequence,
  //   batchCreatorId: paymentData.sourceSystem,
  //   batchExportDate: formatDate(batchExportDate),
  //   status,
  //   lastUpdated: formatDate(eventRaised, moment.ISO_8601)
  // }
}

const getEvents = async () => {
  const client = getClient(PAYMENT_EVENT)
  const eventResults = client.listEntities({ queryOptions: { filter: odata`category eq correlationId` } })
  const events = []
  for await (const event of eventResults) {
    events.push(event)
  }
  return events
}

module.exports = {
  createMIReport
}
