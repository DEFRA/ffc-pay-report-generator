jest.mock('../../app/insights')

jest.mock('../../app/reports')
const { createMIReport: mockCreateMIReport } = require('../../app/reports')

jest.mock('../../app/storage')
const { initialise: mockInitialise } = require('../../app/storage')

describe('app', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    require('../../app/index')
  })

  test('should create storage and create report', async () => {
    expect(mockInitialise).toHaveBeenCalledTimes(1)
    expect(mockCreateMIReport).toHaveBeenCalledTimes(1)
  })
})
