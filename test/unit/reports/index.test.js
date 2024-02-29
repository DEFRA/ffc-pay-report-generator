jest.mock('../../../app/reports/mi/create')
const { createMIReport } = require('../../../app/reports/mi/create')

jest.mock('../../../app/reports/suppressed/create')
const { createSuppressedReport } = require('../../../app/reports/suppressed/create')

jest.mock('../../../app/reports/summary/create')
const { createSummaryReport } = require('../../../app/reports/summary/create')

jest.mock('../../../app/reports/ap-ar-listing/create')
const { createAPARListingReport } = require('../../../app/reports/ap-ar-listing/create')

const { createReports } = require('../../../app/reports/index')

describe('createReports', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should call createMIReport exactly once', async () => {
    await createReports()
    expect(createMIReport).toHaveBeenCalledTimes(1)
  })

  test('should call createSuppressedReport exactly once', async () => {
    await createReports()
    expect(createSuppressedReport).toHaveBeenCalledTimes(1)
  })

  test('should call createSummaryReport exactly once', async () => {
    await createReports()
    expect(createSummaryReport).toHaveBeenCalledTimes(1)
  })

  test('should call createAPARListingReport exactly once', async () => {
    await createReports()
    expect(createAPARListingReport).toHaveBeenCalledTimes(1)
  })
})
