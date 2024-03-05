jest.mock('../../../app/reports/shared/create')
const { createReportsWithSharedData } = require('../../../app/reports/shared/create')

jest.mock('../../../app/reports/suppressed/create')
const { createSuppressedReport } = require('../../../app/reports/suppressed/create')

const { createReports } = require('../../../app/reports/index')

describe('createReports', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should call createReportsWithSharedData exactly once', async () => {
    await createReports()
    expect(createReportsWithSharedData).toHaveBeenCalledTimes(1)
  })

  test('should call createSuppressedReport exactly once', async () => {
    await createReports()
    expect(createSuppressedReport).toHaveBeenCalledTimes(1)
  })
})
