const { sanitizeReports } = require('../../../../app/reports/ap-ar-listing/sanitize-reports')

describe('sanitizeReports', () => {
  test('should sanitize report lines', () => {
    const reportLines = [
      { apValue: 0, arValue: 0, 'D365 Invoice Payment': 100 },
      { apValue: 100, arValue: 0, 'D365 Invoice Payment': 200 },
      { apValue: 0, arValue: 100, 'D365 Invoice Payment': 300 }
    ]

    const { apReportLines, arReportLines } = sanitizeReports(reportLines)

    expect(apReportLines).toHaveLength(1)
    expect(apReportLines[0].apValue).toBe(100)
    expect(apReportLines[0]['D365 Invoice Payment']).toBe(200)

    expect(arReportLines).toHaveLength(1)
    expect(arReportLines[0].arValue).toBe(100)
    expect(arReportLines[0]['D365 Invoice Payment']).toBeUndefined()
  })
})
