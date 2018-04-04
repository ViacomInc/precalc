/* eslint-env jest */

const { getDefaultOpts, wrapInCalc, eq, getOpts } = require('./precalc-test.js')

const DEFAULT_OPTIONS = getDefaultOpts()

describe('wrapInCalc', () => {
  it('should return empty string when input is empty string', () => {
    expect(wrapInCalc('')).toBe('')
  })

  it('should not wrap single operand in calc', () => {
    expect(wrapInCalc('2px')).toBe('2px')
  })

  it('should not use calc and not remove unnecessary + operator', () => {
    expect(wrapInCalc('+2px')).toBe('+2px')
  })

  it('should not use calc and not remove unnecessary - operator', () => {
    expect(wrapInCalc('-2px')).toBe('-2px')
  })

  it('should use calc and not add whitespace around +', () => {
    expect(wrapInCalc('2px+2px')).toBe('calc(2px+2px)')
  })

  it('should use calc and not add whitespace around -', () => {
    expect(wrapInCalc('2px-2px')).toBe('calc(2px-2px)')
  })

  it('should use calc and not add whitespace around *', () => {
    expect(wrapInCalc('2px*2px')).toBe('calc(2px*2px)')
  })

  it('should use calc and not add whitespace around /', () => {
    expect(wrapInCalc('2px/2px')).toBe('calc(2px/2px)')
  })

  it('', () => {
    expect(wrapInCalc('2px  +  2px')).toBe('calc(2px  +  2px)')
  })

  it('', () => {
    expect(wrapInCalc('2px  -  2px')).toBe('calc(2px  -  2px)')
  })

  it('', () => {
    expect(wrapInCalc('2px  *  2px')).toBe('calc(2px  *  2px)')
  })

  it('', () => {
    expect(wrapInCalc('2px  /  2px')).toBe('calc(2px  /  2px)')
  })

  it('', () => {
    expect(wrapInCalc('2px + (2px * 2)')).toBe('calc(2px + (2px * 2))')
  })

  it('', () => {
    expect(wrapInCalc('()')).toBe('calc(())')
  })

  it('', () => {
    expect(wrapInCalc('(5)')).toBe('calc((5))')
  })
})

describe('eq', () => {
  it('should evaluate when the first parameter is an equation', () => {
    expect(eq('5px + 5px')).toBe('10px')
  })

  it('should evaluate when the second parameter is an equation', () => {
    expect(eq({}, '5px + 5px')).toBe('10px')
  })

  it('should return a curried function when an object is passed as the sole parameter', () => {
    const fn = eq({})
    expect(fn).toBeInstanceOf(Function)
    expect(fn.length).toBe(1)
  })

  it("should evaluate an equation that's passed to the curried eq function", () => {
    expect(eq({})('5px + 5px')).toBe('10px')
  })
})

describe('getOpts', () => {
  it('should return the default options when no argument is given', () => {
    expect(getOpts()).toEqual(DEFAULT_OPTIONS)
  })

  it("should not override a valid units array (even if it's empty)", () => {
    expect(getOpts({ units: [] }).units).toEqual([])
  })

  it('should set "throws" to true when the option is undefined', () => {
    expect(getOpts({ throws: undefined }).throws).toEqual(true)
  })

  it('should set "throws" to false when the option is false', () => {
    expect(getOpts({ throws: false }).throws).toEqual(false)
  })

  it('should not override a valid units array', () => {
    expect(getOpts({ units: ['unit'] }).units).toEqual(['unit'])
  })

  it('should add the default units when options.units is "true"', () => {
    expect(getOpts({ units: true }).units).toEqual(DEFAULT_OPTIONS.units)
  })

  it('should add the default units when options.units is "false"', () => {
    expect(getOpts({ units: false }).units).toBe(false)
  })
})
