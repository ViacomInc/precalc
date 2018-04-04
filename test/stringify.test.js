/* eslint-env jest */

const {
  stringify,
  stringifyEquation,
  stringifyEquationItem
} = require('./precalc-test.js')

describe('stringify', () => {
  it('should return empty string', () => {
    expect(stringify('')).toBe('')
  })
})

describe('stringifyEquationItem', () => {
  it('should return empty string', () => {
    expect(stringifyEquationItem()).toBe('')
  })

  it('should return empty string', () => {
    expect(stringifyEquationItem('')).toBe('')
  })

  it('should return empty string', () => {
    expect(stringifyEquationItem(undefined)).toBe('')
  })

  it('should return empty string', () => {
    expect(stringifyEquationItem(null)).toBe('')
  })

  it('should return ( ', () => {
    expect(stringifyEquationItem('(')).toBe('(')
  })

  it('should return )', () => {
    expect(stringifyEquationItem(')')).toBe(')')
  })

  it('should surround input with spaces', () => {
    expect(stringifyEquationItem('string')).toBe(' string ')
  })

  it('should surround input with spaces', () => {
    expect(stringifyEquationItem(' string ')).toBe('  string  ')
  })

  it('should return "0"', () => {
    expect(stringifyEquationItem({ value: 0, unit: '' })).toBe('0')
  })

  it('should return "-99%"', () => {
    expect(stringifyEquationItem({ value: -99, unit: '%' })).toBe('-99%')
  })

  it('should return "200px"', () => {
    expect(stringifyEquationItem({ value: 200, unit: 'px' })).toBe('200px')
  })

  it('should return "200boogers"', () => {
    expect(stringifyEquationItem({ value: 200, unit: 'boogers' })).toBe('200boogers')
  })
})

describe('stringifyEquation', () => {
  it('should stringify non-nested equations', () => {
    const equation = [{ value: 0, unit: 'px' }, '+', { value: 0, unit: 'px' }]
    expect(stringifyEquation(equation)).toBe('0px + 0px')
  })

  it('should stringify with equation as rhs', () => {
    const equation = [
      [{ value: 0, unit: 'px' }, '+', { value: 0, unit: 'px' }],
      '+',
      { value: 0, unit: 'px' }
    ]
    expect(stringifyEquation(equation)).toBe('(0px + 0px) + 0px')
  })

  it('should stringify with equation as lhs', () => {
    const equation = [
      { value: 0, unit: 'px' },
      '+',
      [{ value: 0, unit: 'px' }, '+', { value: 0, unit: 'px' }]
    ]
    expect(stringifyEquation(equation)).toBe('0px + (0px + 0px)')
  })
})
