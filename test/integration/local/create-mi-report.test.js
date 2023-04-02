const { PAYMENT_EVENT } = require('../../../app/constants/event-types')
const { createMIReport } = require('../../../app/reports/mi-report')
const { initialise, getClient } = require('../../../app/storage')

let paymentClient
let event

beforeAll(async () => {
  await initialise()
  paymentClient = getClient(PAYMENT_EVENT)
})

beforeEach(async () => {
  paymentClient.deleteTable()
  paymentClient.createTable()
  event = JSON.parse(JSON.stringify(require('../../mocks/event-store-row')))

  await paymentClient.createEntity(event)
})

describe('process event message', () => {
  test('should create MI report', async () => {
    await createMIReport()
  })
})
