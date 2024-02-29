const { PAYMENT_SUBMITTED, PAYMENT_ACKNOWLEDGED, PAYMENT_PROCESSED, PAYMENT_SETTLED } = require('../../constants/events')

const splitAPAREvents = (events) => {
  const apEvents = []
  const arEvents = []
  for (const event of events) {
    const apEvent = { ...event }
    const filteredAPEvents = []
    const arEvent = { ...event }
    const filteredAREvents = []

    for (const evt of apEvent.events) {
      if (evt.data.ledger !== 'AR') {
        filteredAPEvents.push(evt)
      }
    }
    // we want to check if there are multiple submitted events. If so, we want to show two entries, one for invoice A, one for invoice B
    const submitted = filteredAPEvents.filter(evt => evt.type === PAYMENT_SUBMITTED)
    if (submitted.length > 1) {
      const apEventA = { ...event }
      const filteredAPEventsA = [...filteredAPEvents]
      const idxB = filteredAPEventsA.findIndex(evt => evt.type === PAYMENT_SUBMITTED && evt.data.invoiceNumber.includes('B'))
      filteredAPEventsA.splice(idxB, 1)
      apEventA.events = filteredAPEventsA
      apEvents.push(apEventA)
      // events have been pushed in with B excluded. now remove A from the main events set
      const idxA = filteredAPEvents.findIndex(evt => evt.type === PAYMENT_SUBMITTED && evt.data.invoiceNumber.includes('A'))
      filteredAPEvents.splice(idxA, 1)
    }
    apEvent.events = filteredAPEvents
    apEvents.push(apEvent)

    let includesAREvents = false
    for (const evt of arEvent.events) {
      if (evt.data.ledger === 'AR' || (evt.type !== PAYMENT_PROCESSED && evt.type !== PAYMENT_SUBMITTED && evt.type !== PAYMENT_ACKNOWLEDGED && evt.type !== PAYMENT_SETTLED)) {
        filteredAREvents.push(evt)
      }
      if (evt.data.ledger === 'AR' && (evt.type === PAYMENT_PROCESSED || evt.type === PAYMENT_SUBMITTED || evt.type === PAYMENT_ACKNOWLEDGED)) {
        includesAREvents = true
      }
    }
    if (includesAREvents) {
      arEvent.events = filteredAREvents
      arEvents.push(arEvent)
    }
  }
  return { apEvents, arEvents }
}

module.exports = {
  splitAPAREvents
}
