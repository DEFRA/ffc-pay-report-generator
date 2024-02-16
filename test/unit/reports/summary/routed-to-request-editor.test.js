const { routedToRequestEditor } = require('../../../../app/reports/summary/routed-to-request-editor')
const processedEvent = require('../../../mocks/events/processed')
const ledgerEvent = require('../../../mocks/events/ledger')
const debtEvent = require('../../../mocks/events/debt')
const qcEvent = require('../../../mocks/events/qc')

let events

describe('routed to request editor', () => {
  beforeEach(() => {
    events = []
  })

  test('should return Y for ledger event', () => {
    events = [ledgerEvent]
    const value = routedToRequestEditor(events)
    expect(value).toEqual('Y')
  })

  test('should return Y for debt event', () => {
    events = [debtEvent]
    const value = routedToRequestEditor(events)
    expect(value).toEqual('Y')
  })

  test('should return Y for qc event', () => {
    events = [qcEvent]
    const value = routedToRequestEditor(events)
    expect(value).toEqual('Y')
  })

  test('should return N for any other event type', () => {
    events = [processedEvent]
    const value = routedToRequestEditor(events)
    expect(value).toEqual('N')
  })
})
