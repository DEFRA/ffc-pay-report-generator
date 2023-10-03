const { convertToPence, convertToPounds } = require('../../app/currency-convert')

describe('convert currency', () => {
  test('converts 100 to pence', () => {
    const result = convertToPence(100)
    expect(result).toEqual(10000)
  })

  test('converts 100 to pence with no decimals', () => {
    const result = convertToPence(100.00)
    expect(result).toEqual(10000)
  })

  test('converts -100 to pence', () => {
    const result = convertToPence(-100)
    expect(result).toEqual(-10000)
  })

  test('converts 100.10 to pence', () => {
    const result = convertToPence(100.10)
    expect(result).toEqual(10010)
  })

  test('converts 100.1 to pence', () => {
    const result = convertToPence(100.1)
    expect(result).toEqual(10010)
  })

  test('converts 100 to pence if string', () => {
    const result = convertToPence('100')
    expect(result).toEqual(10000)
  })

  test('converts 100 to pence if string with no decimals', () => {
    const result = convertToPence('100.00')
    expect(result).toEqual(10000)
  })

  test('converts 100.10 to pence if string', () => {
    const result = convertToPence('100.10')
    expect(result).toEqual(10010)
  })

  test('converts 100.1 to pence if string', () => {
    const result = convertToPence('100.1')
    expect(result).toEqual(10010)
  })

  test('returns undefined if no value', () => {
    const result = convertToPence()
    expect(result).toBeUndefined()
  })

  test('returns undefined if undefined', () => {
    const result = convertToPence(undefined)
    expect(result).toBeUndefined()
  })

  test('returns undefined if null', () => {
    const result = convertToPence(null)
    expect(result).toBeUndefined()
  })

  test('returns undefined if object', () => {
    const result = convertToPence({})
    expect(result).toBeUndefined()
  })

  test('returns undefined if array', () => {
    const result = convertToPence([])
    expect(result).toBeUndefined()
  })

  test('returns undefined if true', () => {
    const result = convertToPence(true)
    expect(result).toBeUndefined()
  })

  test('returns undefined if false', () => {
    const result = convertToPence(false)
    expect(result).toBeUndefined()
  })

  test('returns undefined if boolean', () => {
    const result = convertToPence(Boolean())
    expect(result).toBeUndefined()
  })

  test('converts 10000 to pounds', () => {
    const result = convertToPounds(10000)
    expect(result).toEqual('100.00')
  })

  test('converts 10010 to pounds', () => {
    const result = convertToPounds(10010)
    expect(result).toEqual('100.10')
  })
})
