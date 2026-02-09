const moment = require('moment')

describe('getReportLines', () => {
  let getReportLines

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    getReportLines = require('../../../../app/reports/suppressed/get-report-lines').getReportLines
  })

  const makeEvent = ({
    PartitionKey = '1234567890',
    time = 1704067200000,
    data = null
  } = {}) => ({
    PartitionKey,
    time,
    data: data ?? {
      agreementNumber: 'AGR001',
      marketingYear: 2024,
      paymentRequestNumber: 'PR001',
      deltaValue: 10000,
      creditAP: 5000,
      suppressedAR: 3000
    }
  })

  describe('basic functionality', () => {
    test('returns empty array when given empty array', () => {
      expect(getReportLines([])).toEqual([])
    })

    test('maps single event to report line correctly', () => {
      const result = getReportLines([makeEvent()])
      expect(result[0]).toEqual({
        frn: '1234567890',
        agreementNumber: 'AGR001',
        marketingYear: 2024,
        paymentRequestNumber: 'PR001',
        deltaValue: '100.00',
        creditAP: '50.00',
        suppressedAR: '30.00',
        suppressed: moment(1704067200000).format('DD/MM/YYYY')
      })
    })

    test('maps multiple events to report lines', () => {
      const events = [
        makeEvent({ PartitionKey: '1111111111' }),
        makeEvent({
          PartitionKey: '2222222222',
          data: { deltaValue: 20000, creditAP: 10000, suppressedAR: 6000, agreementNumber: 'AGR002', marketingYear: 2024, paymentRequestNumber: 'PR002' }
        })
      ]
      const result = getReportLines(events)
      expect(result.map(r => r.frn)).toEqual(['1111111111', '2222222222'])
    })
  })

  describe('currency conversion', () => {
    test('converts values correctly', () => {
      const data = { deltaValue: 12345, creditAP: 67890, suppressedAR: 99999, agreementNumber: 'AGR001', marketingYear: 2024, paymentRequestNumber: 'PR001' }
      const result = getReportLines([makeEvent({ data })])
      expect(result[0]).toMatchObject({
        deltaValue: '123.45',
        creditAP: '678.90',
        suppressedAR: '999.99'
      })
    })

    test('handles zero values', () => {
      const data = { deltaValue: 0, creditAP: 0, suppressedAR: 0, agreementNumber: 'AGR001', marketingYear: 2024, paymentRequestNumber: 'PR001' }
      const result = getReportLines([makeEvent({ data })])
      expect(result[0]).toMatchObject({
        deltaValue: '0.00',
        creditAP: '0.00',
        suppressedAR: '0.00'
      })
    })

    test('handles negative values', () => {
      const data = { deltaValue: -10000, creditAP: -5000, suppressedAR: -3000, agreementNumber: 'AGR001', marketingYear: 2024, paymentRequestNumber: 'PR001' }
      const result = getReportLines([makeEvent({ data })])
      expect(result[0]).toMatchObject({
        deltaValue: '-100.00',
        creditAP: '-50.00',
        suppressedAR: '-30.00'
      })
    })

    test('handles missing data gracefully', () => {
      const event = { PartitionKey: 'AAA', time: 1704067200000 }
      const result = getReportLines([event])
      expect(result[0]).toMatchObject({
        frn: 'AAA',
        agreementNumber: undefined,
        marketingYear: undefined,
        paymentRequestNumber: undefined,
        deltaValue: '0.00',
        creditAP: '0.00',
        suppressedAR: '0.00'
      })
    })
  })

  describe('date formatting', () => {
    test('formats date correctly', () => {
      const ts = 1704067200000
      const result = getReportLines([makeEvent({ time: ts })])
      expect(result[0].suppressed).toBe(moment(ts).format('DD/MM/YYYY'))
    })

    test('handles null timestamp', () => {
      const result = getReportLines([makeEvent({ time: null })])
      expect(result[0].suppressed).toBe(moment(null).format('DD/MM/YYYY'))
    })
  })
})
