jest.mock('../../../app/reports/suppressed/create')
const { createSuppressedReport } = require('../../../app/reports/suppressed/create')

const { createReports } = require('../../../app/reports/index')

describe('create reports', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should call createSuppressedReport and createReportsWithSharedData exactly once', async () => {
    await createReports()
    expect(createSuppressedReport).toHaveBeenCalledTimes(1)
  })

  test('should handle errors thrown by createSuppressedReport', async () => {
    createSuppressedReport.mockRejectedValueOnce(new Error('Suppressed report error'))
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    await createReports()

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('An error occurred while creating reports: Suppressed report error'))
    consoleErrorSpy.mockRestore()
  })
})
