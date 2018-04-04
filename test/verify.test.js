/* eslint-env jest */

const {
  evaluate,
  verifyReducedEquation,
  throwForInvalidSequence,
  validateTypeSequence
} = require('./precalc-test.js')

describe('evaluate', () => {
  it('', () => {
    expect(evaluate('')).toBe(undefined)
  })

  it('', () => {
    expect(evaluate('0')).toBe(0)
  })

  it('', () => {
    expect(evaluate('5 + 5')).toBe(10)
  })

  it('', () => {
    expect(evaluate('5 + 5px')).toBe(10)
  })

  it('', () => {
    expect(evaluate('5px + 5px')).toBe(10)
  })

  it('', () => {
    expect(evaluate('5px + 5%')).toBe(10)
  })

  it('should return error for invalid input', () => {
    expect(evaluate('0 ) 0')).toBeInstanceOf(Error)
  })

  it('should return error for invalid input', () => {
    expect(evaluate('0++0')).toBeInstanceOf(Error)
  })
})

describe('verifyReducedEquation', () => {
  it('', () => {
    expect(verifyReducedEquation('5 - 5', '5 ) 5')).toBeInstanceOf(Error)
  })

  it('', () => {
    expect(verifyReducedEquation('5 ) 5', '5 - 5')).toBeInstanceOf(Error)
  })

  it('', () => {
    expect(verifyReducedEquation('5 + 5', '5 - 5')).toBeInstanceOf(Error)
  })

  it('', () => {
    expect(verifyReducedEquation('5 + 5', '5 + 5')).toBe(10)
  })
})

describe('throwForInvalidSequence', () => {
  it('valid', () => {
    expect(throwForInvalidSequence(undefined, { value: 0, unit: '' })).toEqual({ value: 0, unit: '' })
    expect(throwForInvalidSequence('+', { value: 0, unit: '' })).toEqual({ value: 0, unit: '' })
    expect(throwForInvalidSequence('(', { value: 0, unit: '' })).toEqual({ value: 0, unit: '' })

    expect(throwForInvalidSequence(undefined, '(')).toBe('(')
    expect(throwForInvalidSequence('+', '(')).toBe('(')
    expect(throwForInvalidSequence('(', '(')).toBe('(')

    expect(throwForInvalidSequence({ value: 0, unit: '' }, '+')).toBe('+')
    expect(throwForInvalidSequence({ value: 0, unit: '' }, ')')).toBe(')')
    expect(throwForInvalidSequence({ value: 0, unit: '' }, undefined)).toBe(undefined)

    expect(throwForInvalidSequence(')', '+')).toBe('+')
    expect(throwForInvalidSequence(')', ')')).toBe(')')
    expect(throwForInvalidSequence(')', undefined)).toBe(undefined)
  })

  it('invalid', () => {
    expect(() => throwForInvalidSequence('+', '+')).toThrow()
  })

  it('', () => {
    expect(() => throwForInvalidSequence(undefined, '+')).toThrow()
  })

  it('', () => {
    expect(() => throwForInvalidSequence('+', undefined)).toThrow()
  })

  it('', () => {
    expect(() => throwForInvalidSequence('(', ')')).toThrow()
  })

  it('', () => {
    expect(() => throwForInvalidSequence('+', '+')).toThrow()
  })
})

describe('validateTypeSequence', () => {
  it('', () => {
    expect(validateTypeSequence(undefined, 'operand')).toBe(true)
  })

  it('', () => {
    expect(validateTypeSequence(undefined, '(')).toBe(true)
  })

  it('', () => {
    expect(validateTypeSequence(undefined, 'operator')).toBe(false)
  })

  it('', () => {
    expect(validateTypeSequence('operator', 'operand')).toBe(true)
  })

  it('', () => {
    expect(validateTypeSequence('operator', '(')).toBe(true)
  })

  it('', () => {
    expect(validateTypeSequence('operator', 'operator')).toBe(false)
  })

  it('', () => {
    expect(validateTypeSequence('(', 'operand')).toBe(true)
  })

  it('', () => {
    expect(validateTypeSequence('(', '(')).toBe(true)
  })

  it('', () => {
    expect(validateTypeSequence('(', 'operator')).toBe(false)
  })

  it('', () => {
    expect(validateTypeSequence('operand', 'operator')).toBe(true)
  })

  it('', () => {
    expect(validateTypeSequence('operand', ')')).toBe(true)
  })

  it('', () => {
    expect(validateTypeSequence('operand', undefined)).toBe(true)
  })

  it('', () => {
    expect(validateTypeSequence('operand', 'operand')).toBe(false)
  })

  it('', () => {
    expect(validateTypeSequence(')', 'operator')).toBe(true)
  })

  it('', () => {
    expect(validateTypeSequence(')', ')')).toBe(true)
  })

  it('', () => {
    expect(validateTypeSequence(')', undefined)).toBe(true)
  })

  it('', () => {
    expect(validateTypeSequence(')', 'operand')).toBe(false)
  })

  it('should return default', () => {
    expect(validateTypeSequence('+', '+')).toBe(false)
  })
})
