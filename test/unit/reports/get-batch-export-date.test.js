const extractedEvent = require('../../mocks/events/extracted')
const enrichedEvent = require('../../mocks/events/enriched')

const { getBatchExportDate } = require('../../../app/reports/mi-report/get-batch-export-date')

const events = [extractedEvent, enrichedEvent]

describe('get batch export date', () => {
  test('should return the batch export date in DD/MM/YYYY format', () => {
    const batchExportDate = getBatchExportDate(events)
    expect(batchExportDate).toEqual('30/03/2023')
  })

  test('should return an empty string if no extracted event is found', () => {
    const batchExportDate = getBatchExportDate([enrichedEvent])
    expect(batchExportDate).toEqual('')
  })
})
