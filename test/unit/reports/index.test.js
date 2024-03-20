const { createReports } = require('../../../app/reports/index')
const { createReportsWithSharedData } = require('../../../app/reports/shared/create')
const { createSuppressedReport } = require('../../../app/reports/suppressed/create')
const { createAPARListingReport } = require('../../../app/reports/ap-ar-listing/create')

jest.mock('../../../app/reports/shared/create', () => ({
  createReportsWithSharedData: jest.fn().mockResolvedValue()
}))

jest.mock('../../../app/reports/suppressed/create', () => ({
  createSuppressedReport: jest.fn().mockResolvedValue()
}))

jest.mock('../../../app/reports/ap-ar-listing/create', () => ({
  createAPARListingReport: jest.fn().mockResolvedValue()
}))

describe('createReports', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should call createReportsWithSharedData, createSuppressedReport, and createAPARListingReport exactly once', async () => {
    await createReports()
    expect(createReportsWithSharedData).toHaveBeenCalledTimes(1)
    expect(createSuppressedReport).toHaveBeenCalledTimes(1)
    expect(createAPARListingReport).toHaveBeenCalledTimes(1)
  })
})
