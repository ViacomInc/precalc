/* eslint-env jest */

const {
  isOperator,
  isOperand,
  isEquation,
  stringIsEquation,
  getItemType,
  haveSameUnit,
  hasNoUnit,
  isValidUnit,
  isParenthesis,
  charIsReserved,
  EqItem,
  zero,
  removeUnitIfZero,
  opposite,
  hasMoreThanOnePeriod
} = require('./precalc-test.js')

describe('isOperator', () => {
  it('should not recognize empty string as an operator', () => {
    expect(isOperator('')).toBe(false)
  })

  it('should recognize + as an operator', () => {
    expect(isOperator('+')).toBe(true)
  })

  it('should recognize - as an operator', () => {
    expect(isOperator('-')).toBe(true)
  })

  it('should recognize * as an operator', () => {
    expect(isOperator('*')).toBe(true)
  })

  it('should recognize / as an operator', () => {
    expect(isOperator('/')).toBe(true)
  })

  it('should not recognize ++ as an operator', () => {
    expect(isOperator('++')).toBe(false)
  })

  it('should not recognize -- as an operator', () => {
    expect(isOperator('--')).toBe(false)
  })

  it('should not recognize % as an operator', () => {
    expect(isOperator('%')).toBe(false)
  })

  it('should not recognize ^ as an operator', () => {
    expect(isOperator('^')).toBe(false)
  })

  it('should not recognize ! as an operator', () => {
    expect(isOperator('!')).toBe(false)
  })
})

describe('isOperand', () => {
  it('should not recognize undefined as an operand', () => {
    expect(isOperand()).toBe(false)
  })

  it('should not recognize empty object as an operand', () => {
    expect(isOperand({})).toBe(false)
  })

  it('should not recognize object with value prop but no unit prop as an operand', () => {
    expect(isOperand({ value: false })).toBe(false)
  })

  it('should not recognize object with unit prop but no value prop as an operand', () => {
    expect(isOperand({ unit: false })).toBe(false)
  })

  it('should recognize object with value and unit props as an operand', () => {
    expect(isOperand({ value: false, unit: false })).toBe(true)
  })
})

describe('isEquation', () => {
  it('should not recognize undefined as an equation', () => {
    expect(isEquation()).toBe(false)
  })

  it('should not recognize a string as an equation', () => {
    expect(isEquation('')).toBe(false)
  })

  it('should not recognize an object as an equation', () => {
    expect(isEquation({})).toBe(false)
  })

  it('should recognize an array as an equation', () => {
    expect(isEquation([])).toBe(true)
  })
})

describe('stringIsEquation', () => {
  it('should not recognize empty string as an equation', () => {
    expect(stringIsEquation('')).toBe(false)
  })

  it('should not recognize equation with invalid operand as an equation', () => {
    expect(stringIsEquation('5px & 5px')).toBe(false)
  })

  it('should not recognize * as an equation', () => {
    expect(stringIsEquation('*')).toBe(false)
  })

  it('should not recognize / as an equation', () => {
    expect(stringIsEquation('/')).toBe(false)
  })

  it('should not recognize + as an equation', () => {
    expect(stringIsEquation('+')).toBe(false)
  })

  it('should not recognize - as an equation', () => {
    expect(stringIsEquation('-')).toBe(false)
  })

  it('should recognize ( as an equation', () => {
    expect(stringIsEquation('(')).toBe(true)
  })

  it('should recognize ) as an equation', () => {
    expect(stringIsEquation(')')).toBe(true)
  })

  it('', () => {
    expect(stringIsEquation('()')).toBe(true)
  })

  it('', () => {
    expect(stringIsEquation('5+5')).toBe(true)
  })

  it('', () => {
    expect(stringIsEquation('5+ 5')).toBe(true)
  })

  it('', () => {
    expect(stringIsEquation('5 + 5')).toBe(true)
  })

  it('', () => {
    expect(stringIsEquation('5 +5')).toBe(true)
  })

  it('', () => {
    expect(stringIsEquation('5 +-5')).toBe(true)
  })

  it('', () => {
    expect(stringIsEquation('5 + -5')).toBe(true)
  })

  it('', () => {
    expect(stringIsEquation('5+(5)')).toBe(true)
  })
})

describe('getItemType', () => {
  it('', () => {
    expect(getItemType()).toBe(undefined)
  })

  it('', () => {
    expect(getItemType(null)).toBe(null)
  })

  it('', () => {
    expect(getItemType('+')).toBe('operator')
  })

  it('', () => {
    expect(getItemType('-')).toBe('operator')
  })

  it('', () => {
    expect(getItemType('/')).toBe('operator')
  })

  it('', () => {
    expect(getItemType('*')).toBe('operator')
  })

  it('', () => {
    expect(getItemType('%')).toBe('%')
  })

  it('', () => {
    expect(getItemType('(')).toBe('(')
  })

  it('', () => {
    expect(getItemType(')')).toBe(')')
  })

  it('', () => {
    expect(getItemType({})).toEqual({})
  })

  it('', () => {
    expect(getItemType({ value: false, unit: false })).toEqual('operand')
  })

  it('', () => {
    expect(getItemType({ value: 10, unit: 'px' })).toEqual('operand')
  })
})

describe('haveSameUnit', () => {
  it('', () => {
    expect(haveSameUnit({ unit: 'true' }, { unit: 'false' })).toBe(false)
  })

  it('', () => {
    expect(haveSameUnit({ unit: '0' }, { unit: 0 })).toBe(false)
  })

  it('', () => {
    expect(haveSameUnit({ unit: '0' }, { unit: '0' })).toBe(true)
  })

  it('', () => {
    expect(haveSameUnit({}, {})).toBe(true)
  })
})

describe('hasNoUnit', () => {
  it('', () => {
    expect(hasNoUnit({})).toBe(true)
  })

  it('', () => {
    expect(hasNoUnit({ unit: false })).toBe(true)
  })

  it('', () => {
    expect(hasNoUnit({ unit: true })).toBe(false)
  })

  it('', () => {
    expect(hasNoUnit({ unit: '' })).toBe(true)
  })

  it('', () => {
    expect(hasNoUnit({ unit: 'px' })).toBe(false)
  })
})

describe('isValidUnit', () => {
  it('', () => {
    expect(isValidUnit([], 'px')).toBe(false)
  })

  it('', () => {
    expect(isValidUnit([], '')).toBe(true)
  })

  it('', () => {
    expect(isValidUnit(['px'], '')).toBe(true)
  })

  it('', () => {
    expect(isValidUnit(['px'], 'px')).toBe(true)
  })

  it('', () => {
    expect(isValidUnit(['vh', 'px'], 'px')).toBe(true)
  })
})

describe('isParenthesis', () => {
  it('', () => {
    expect(isParenthesis('')).toBe(false)
  })

  it('', () => {
    expect(isParenthesis('px')).toBe(false)
  })

  it('', () => {
    expect(isParenthesis('(')).toBe(true)
  })

  it('', () => {
    expect(isParenthesis(')')).toBe(true)
  })
})

describe('charIsReserved', () => {
  it('', () => {
    expect(charIsReserved('')).toBe(false)
  })

  it('', () => {
    expect(charIsReserved('%')).toBe(false)
  })

  it('', () => {
    expect(charIsReserved('x')).toBe(false)
  })

  it('', () => {
    expect(charIsReserved('+')).toBe(true)
  })

  it('', () => {
    expect(charIsReserved('-')).toBe(true)
  })

  it('', () => {
    expect(charIsReserved('*')).toBe(true)
  })

  it('', () => {
    expect(charIsReserved('*')).toBe(true)
  })

  it('', () => {
    expect(charIsReserved('(')).toBe(true)
  })

  it('', () => {
    expect(charIsReserved(')')).toBe(true)
  })
})

describe('EqItem', () => {
  it('', () => {
    expect(EqItem()).toEqual({ value: 0, unit: '' })
  })

  it('', () => {
    expect(EqItem(20)).toEqual({ value: 20, unit: '' })
  })

  it('', () => {
    expect(EqItem(null, 'px')).toEqual({ value: 0, unit: '' })
  })

  it('', () => {
    expect(EqItem(0, '')).toEqual({ value: 0, unit: '' })
  })

  it('', () => {
    expect(EqItem(0, 'px')).toEqual({ value: 0, unit: '' })
  })

  it('', () => {
    expect(EqItem(20, 'px')).toEqual({ value: 20, unit: 'px' })
  })

  it('', () => {
    expect(EqItem('20', 'px')).toEqual({ value: '20', unit: 'px' })
  })
})

describe('zero', () => {
  it('should recognize zero object as zero', () => {
    expect(zero()).toEqual({ value: 0, unit: '' })
  })
})

describe('removeUnitIfZero', () => {
  it('', () => {
    expect(removeUnitIfZero(false)).toBe(false)
  })

  it('', () => {
    expect(removeUnitIfZero({})).toEqual({ value: 0, unit: '' })
  })

  it('', () => {
    expect(removeUnitIfZero({ value: 0, unit: 'px' })).toEqual({ value: 0, unit: '' })
  })

  it('', () => {
    expect(removeUnitIfZero({ value: 20, unit: 'px' })).toEqual({ value: 20, unit: 'px' })
  })
})

describe('opposite', () => {
  it('', () => {
    expect(opposite({ value: 0, unit: 'px' })).toEqual({ value: 0, unit: '' })
  })

  it('', () => {
    expect(opposite({ value: 5, unit: 'px' })).toEqual({ value: -5, unit: 'px' })
  })

  it('', () => {
    expect(opposite({ value: -5, unit: 'px' })).toEqual({ value: 5, unit: 'px' })
  })

  it('', () => {
    expect(opposite({ value: 5 })).toEqual({ value: -5, unit: '' })
  })

  it('', () => {
    expect(opposite({ value: -5 })).toEqual({ value: 5, unit: '' })
  })
})

describe('hasMoreThanOnePeriod', () => {
  it('', () => {
    expect(hasMoreThanOnePeriod('')).toBe(false)
  })

  it('', () => {
    expect(hasMoreThanOnePeriod('.')).toBe(false)
  })

  it('', () => {
    expect(hasMoreThanOnePeriod('..')).toBe(true)
  })

  it('', () => {
    expect(hasMoreThanOnePeriod('. .')).toBe(true)
  })

  it('', () => {
    expect(hasMoreThanOnePeriod('.x.')).toBe(true)
  })
})
