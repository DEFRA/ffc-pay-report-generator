const { PAYMENT_SUBMITTED, PAYMENT_ACKNOWLEDGED, PAYMENT_PROCESSED, PAYMENT_SETTLED } = require('../../constants/events')

const splitAPAREvents = (events) => {
  const apEvents = []
  const arEvents = []

  for (const event of events) {
    const apEvent = { ...event }
    const arEvent = { ...event }

    const filteredAPEvents = apEvent.events.filter(evt => evt.data.ledger === 'AP')
    const filteredAREvents = arEvent.events.filter(evt => evt.data.ledger === 'AR' || ![PAYMENT_PROCESSED, PAYMENT_SUBMITTED, PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED].includes(evt.type))

    const submittedAPEvents = filteredAPEvents.filter(evt => evt.type === PAYMENT_SUBMITTED)
    if (submittedAPEvents.length > 1) {
      const idxB = filteredAPEvents.findIndex(evt => evt.type === PAYMENT_SUBMITTED && evt.data.invoiceNumber.includes('B'))
      const apEventA = { ...apEvent }
      apEventA.events = filteredAPEvents.filter((_, index) => index !== idxB)
      apEvents.push(apEventA)
      const idxA = filteredAPEvents.findIndex(evt => evt.type === PAYMENT_SUBMITTED && evt.data.invoiceNumber.includes('A'))
      filteredAPEvents.splice(idxA, 1)
    }

    apEvent.events = filteredAPEvents
    apEvents.push(apEvent)

    if (filteredAREvents.length > 0) {
      arEvent.events = filteredAREvents
      arEvents.push(arEvent)
    }
  }

  return { apEvents, arEvents }
}

module.exports = {
  splitAPAREvents
}
