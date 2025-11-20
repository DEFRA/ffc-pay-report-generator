const { convertToPence, convertToPounds } = require('../../app/currency-convert')

describe('convert currency', () => {
  describe('convertToPence', () => {
    test.each([
      [100, 10000],
      [100.00, 10000],
      [-100, -10000],
      [100.10, 10010],
      [100.1, 10010],
      ['100', 10000],
      ['100.00', 10000],
      ['100.10', 10010],
      ['100.1', 10010]
    ])('converts %p to pence => %p', (input, expected) => {
      expect(convertToPence(input)).toBe(expected)
    })

    test.each([undefined, null, {}, [], true, false, Boolean()])(
      'returns undefined for invalid input %p',
      (input) => {
        expect(convertToPence(input)).toBeUndefined()
      }
    )
  })

  describe('convertToPounds', () => {
    test.each([
      [10000, '100.00'],
      [10010, '100.10']
    ])('converts %p to pounds => %p', (input, expected) => {
      expect(convertToPounds(input)).toBe(expected)
    })
  })
})
