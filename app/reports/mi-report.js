const { PAYMENT_EVENT } = require('../constants/event-types')
const { convertToPence } = require('../currency-convert')
const { getClient, odata, writeFile } = require('../storage')
const { reportsConfig } = require('../config')

const createMIReport = async () => {
  const events = await getEvents()
  const groupedEvents = groupEventsByCorrelationId(events)
  const orderedEvents = orderGroupedEvents(groupedEvents)
  const reportLines = getReportLines(orderedEvents)
  const csv = convertToCSV(reportLines)
  await writeFile(reportsConfig.miReportName, csv)
  console.log(`MI report created: ${reportsConfig.miReportName}`)
}

const getEvents = async () => {
  const client = getClient(PAYMENT_EVENT)
  const eventResults = client.listEntities({ queryOptions: { filter: odata`category eq 'correlationId'` } })
  const events = []
  for await (const event of eventResults) {
    event.data = JSON.parse(event.data)
    events.push(event)
  }
  return events
}

const groupEventsByCorrelationId = (events) => {
  return [...events.reduce((x, y) => {
    // group by correlation key, so create key representing the combination
    // exclude account code as past requests vary based on ledger
    const key = y.partitionKey

    // if key doesn't exist then first instance so create new group
    const item = x.get(key) || Object.assign({}, { correlationId: key, events: [] })
    item.events.push(y)

    return x.set(key, item)
  }, new Map()).values()]
}

const orderGroupedEvents = (events) => {
  return events.map(group => {
    const sortedEvents = group.events.sort((a, b) => {
      return new Date(a.time) - new Date(b.time)
    })
    return {
      correlationId: group.correlationId,
      events: sortedEvents
    }
  })
}

const getReportLines = (events) => {
  return events.map(event => ({
    id: event.correlationId,
    frn: event.events[0].data.frn,
    claimNumber: event.events[0].data.claimNumber,
    agreementNumber: event.events[0].data.agreementNumber,
    schemeYear: event.events[0].data.marketingYear,
    invoiceNumber: getInvoiceNumber(event.events),
    preferredPaymentCurrency: getCurrency(event.events),
    paymentInvoiceNumber: event.events[0].data.paymentRequestNumber,
    totalAmount: getValue(event.events),
    batchId: event.events[0].data.batch ?? 'Transaction',
    batchCreatorId: event.events[0].data.sourceSystem,
    batchExportDate: getBatchExportDate(event.events),
    status: getStatus(event.events),
    lastUpdated: event.events[event.events.length - 1].time
  }))
}

const getInvoiceNumber = (events) => {
  const enrichmentEvent = events.find(event => event.type === 'uk.gov.defra.ffc.pay.payment.enriched')
  if (enrichmentEvent) {
    return enrichmentEvent.data.invoiceNumber
  }
  return events[0].data.invoiceNumber ?? 'Unknown'
}

const getCurrency = (events) => {
  const enrichmentEvent = events.find(event => event.type === 'uk.gov.defra.ffc.pay.payment.enriched')
  if (enrichmentEvent) {
    return enrichmentEvent.data.currency
  }
  return events[0].data.currency ?? 'Unknown'
}

const getValue = (events) => {
  const enrichmentEvent = events.find(event => event.type === 'uk.gov.defra.ffc.pay.payment.enriched')
  if (enrichmentEvent) {
    return enrichmentEvent.data.value
  }
  const extractedEvent = events.find(event => event.type === 'uk.gov.defra.ffc.pay.payment.extracted')
  if (extractedEvent) {
    return convertToPence(extractedEvent.data.value)
  }
  return convertToPence(events[0].data.value)
}

const getBatchExportDate = (events) => {
  const extractedEvent = events.find(event => event.type === 'uk.gov.defra.ffc.pay.payment.extracted')
  if (extractedEvent) {
    return extractedEvent.time
  }
  return ''
}

const getStatus = (events) => {
  const eventMap = {
    'uk.gov.defra.ffc.pay.payment.extracted': 'Batch received',
    'uk.gov.defra.ffc.pay.payment.enriched': 'Request enriched for downstream processing',
    'uk.gov.defra.ffc.pay.payment.paused.debt': 'Waiting for debt data',
    'uk.gov.defra.ffc.pay.payment.debt.attached': 'Debt data attached',
    'uk.gov.defra.ffc.pay.payment.paused.ledger': 'Waiting for ledger assignment',
    'uk.gov.defra.ffc.pay.payment.ledger.assigned': 'Ledger assigned',
    'uk.gov.defra.ffc.pay.payment.ledger.quality-check.pending': 'Waiting for ledger quality check',
    'uk.gov.defra.ffc.pay.payment.ledger.quality-check.failed': 'Ledger quality check failed, waiting for correction',
    'uk.gov.defra.ffc.pay.payment.ledger.quality-check.passed': 'Ledger quality check passed',
    'uk.gov.defra.ffc.pay.payment.processed': 'Final payment request state calculated',
    'uk.gov.defra.ffc.pay.payment.submitted': 'Submitted to D365',
    'uk.gov.defra.ffc.pay.payment.acknowledged': 'Acknowledged by D365',
    'uk.gov.defra.ffc.pay.payment.settled': 'Settled by D365'
  }
  const lastEvent = events[events.length - 1]
  return eventMap[lastEvent.type]
}

const convertToCSV = (data) => {
  let csv = ''
  csv = data.map(row => Object.values(row))
  csv.unshift(Object.keys(data[0]))
  return `"${csv.join('"\n"').replace(/,/g, '","')}"`
}

module.exports = {
  createMIReport
}
