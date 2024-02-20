const { getDebtType } = require('../../../../app/reports/summary/get-debt-type')

const processedEvent = require('../../../mocks/events/processed')
const ledgerEvent = require('../../../mocks/events/ledger')
const submittedEvent = require('../../../mocks/events/submitted')

let events
const ev1 = JSON.parse(JSON.stringify(ledgerEvent))
ev1.data.debtType = 'irr'
const ev2 = JSON.parse(JSON.stringify(processedEvent))
ev2.data.debtType = 'adm'
const ev3 = JSON.parse(JSON.stringify(submittedEvent))
ev3.data.debtType = 'irr'

describe('get debt type', () => {
  beforeEach(() => {
    events = []
  })

  test('should return ledger event debt type if present', () => {
    events = [ev1]
    const value = getDebtType(events)
    expect(value).toEqual('Irregular')
  })

  test('should return ledger event debt type if present, even if processedEvent also present', () => {
    events = [ev1, ev2]
    const value = getDebtType(events)
    expect(value).toEqual('Irregular')
  })

  test('should return processed event debt type if present, as long as not ledger event present', () => {
    events = [ev2]
    const value = getDebtType(events)
    expect(value).toEqual('Administrative')
  })

  test('should return null if ledger and processed events not present', () => {
    events = [ev3]
    const value = getDebtType(events)
    expect(value).toEqual(null)
  })

  test('should return null if debt type not recognised', () => {
    ev1.data.debtType = 'madeupstring'
    events = [ev1]
    const value = getDebtType(events)
    expect(value).toEqual(null)
  })
})
