const sanitizeReports = (reportLines) => {
  const apReportLines = reportLines.filter((line) => line.apValue !== 0)
  const arReportLines = reportLines.filter((line) => line.arValue !== 0)
  for (const arReportLine in arReportLines) {
    delete arReportLine['D365 Invoice Payment']
  }
  return { apReportLines, arReportLines }
}
module.exports = {
  sanitizeReports
}
