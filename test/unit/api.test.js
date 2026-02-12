const wreck = require('@hapi/wreck')

jest.mock('@hapi/wreck', () => ({
  get: jest.fn()
}))

const { get } = require('../../app/api')

describe('api', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('get', () => {
    test('calls wreck.get with correct URL and token', async () => {
      const mockResponse = { data: 'mock' }
      wreck.get.mockResolvedValue(mockResponse)

      const url = 'https://example.com'
      const token = 'Bearer abc123'
      const result = await get(url, token)

      expect(wreck.get).toHaveBeenCalledWith(url, {
        headers: { Authorization: token },
        json: true
      })
      expect(result).toBe(mockResponse)
    })

    test('defaults token to empty string if not provided', async () => {
      const mockResponse = { data: 'mock' }
      wreck.get.mockResolvedValue(mockResponse)

      const url = 'https://example.com'
      const result = await get(url)

      expect(wreck.get).toHaveBeenCalledWith(url, {
        headers: { Authorization: '' },
        json: true
      })
      expect(result).toBe(mockResponse)
    })
  })
})
