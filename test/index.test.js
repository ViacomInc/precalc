/* eslint-env jest */

const { eq, calc } = require('./precalc-test.js')

describe('single input', () => {
  it('empty string', () => {
    const result = calc('')
    expect(result).toBe('')
  })

  it('0vh', () => {
    const result = calc('0vh')
    expect(result).toBe('0')
  })

  it('5vh +', () => {
    expect(() => calc('5vh +')).toThrow()
  })

  it('+ 5vh', () => {
    expect(() => calc('+ 5vh')).toThrow()
  })

  it('5vh5', () => {
    expect(() => calc('5vh5')).toThrow()
  })

  it('5vh', () => {
    const result = calc('5vh')
    expect(result).toBe('5vh')
  })

  it('(5vh)', () => {
    const result = calc('(5vh)')
    expect(result).toBe('5vh')
  })

  it('((5vh))', () => {
    const result = calc('((5vh))')
    expect(result).toBe('5vh')
  })

  it('5.5.5', () => {
    expect(() => calc('5.5.5')).toThrow()
  })

  it('5.5.5vh', () => {
    expect(() => calc('5.5.5vh')).toThrow()
  })

  it('vh', () => {
    expect(() => calc('vh')).toThrow()
  })

  it('5invalidunit', () => {
    expect(() => calc('5invalidunit')).toThrow()
  })

  it('()', () => {
    expect(() => calc('()')).toThrow()
  })
})

describe('letters without numbers', () => {
  it('px + 2px', () => {
    expect(() => calc('px + 2px')).toThrow()
  })

  it('2px + px', () => {
    expect(() => calc('2px + px')).toThrow()
  })

  it('px', () => {
    expect(() => calc('px')).toThrow()
  })
})

describe('equations that start with negative numbers', () => {
  it('-5px', () => {
    expect(calc('-5px')).toBe('-5px')
  })

  it('  -5px + 2px', () => {
    expect(calc('  -5px + 2px')).toBe('-3px')
  })

  it('-5px + 2px', () => {
    expect(calc('-5px + 2px')).toBe('-3px')
  })
})

describe('equations that normalizeInputEquation will modify', () => {
  it('2 +2', () => {
    expect(calc('2 +2')).toBe('4')
  })

  it('2 -2', () => {
    expect(calc('2 -2')).toBe('0')
  })

  it('2 +(2)', () => {
    expect(calc('2 +(2)')).toBe('4')
  })

  it('2 -(2)', () => {
    expect(calc('2 -(2)')).toBe('0')
  })

  it('2 + +2', () => {
    expect(calc('2 + +2')).toBe('4')
  })

  it('2 + +(2)', () => {
    expect(calc('2 + +(2)')).toBe('4')
  })

  it('2 +-(2)', () => {
    expect(calc('2 +-(2)')).toBe('0')
  })

  it('2 +-2', () => {
    expect(calc('2 +-2')).toBe('0')
  })
})

describe('invalid characters', () => {
  it('&1px + 1px', () => {
    expect(() => calc('&1px + 1px')).toThrow()
  })

  it('1px + 1px&', () => {
    expect(() => calc('1px + 1px&')).toThrow()
  })

  it('1px &1px', () => {
    expect(() => calc('1px &1px')).toThrow()
  })

  it('&1px    +1px', () => {
    expect(() => calc('&1px    +1px')).toThrow()
  })

  it('1px    +1px&', () => {
    expect(() => calc('1px    +1px&')).toThrow()
  })

  it('1px    &1px', () => {
    expect(() => calc('1px    &1px')).toThrow()
  })
})

describe('operator placement', () => {
  it('2vh -2vh', () => {
    const result = calc('2vh -2vh')
    expect(result).toBe('0')
  })

  it('2vh +2vh', () => {
    const result = calc('2vh +2vh')
    expect(result).toBe('4vh')
  })

  it('2vh + (-2vh + 2px)', () => { // negative number as first inside parentheses
    const result = calc('2vh + (-2vh + 2px)')
    expect(result).toBe('2px')
  })

  it('0 * (2px + -2vh)', () => { // negative number as first inside parentheses
    const result = calc('0 * (2px + -2vh)')
    expect(result).toBe('0')
  })

  it('2px ++(2vh)', () => {
    const result = eq('2px ++(2vh)')
    expect(result).toBe('2px + 2vh')
  })

  it('2px --(2vh)', () => {
    const result = eq('2px --(2vh)')
    expect(result).toBe('2px + 2vh')
  })

  it('2px +-(2vh)', () => {
    const result = eq('2px +-(2vh)')
    expect(result).toBe('2px - 2vh')
  })

  it('2px -+(2vh)', () => {
    const result = eq('2px -+(2vh)')
    expect(result).toBe('2px - 2vh')
  })

  it('2px ++2vh', () => {
    const result = eq('2px ++2vh')
    expect(result).toBe('2px + 2vh')
  })

  it('2px --2vh', () => {
    const result = eq('2px --2vh')
    expect(result).toBe('2px + 2vh')
  })

  it('2px +-2vh', () => {
    const result = eq('2px +-2vh')
    expect(result).toBe('2px - 2vh')
  })

  it('2px -+2vh', () => {
    const result = eq('2px -+2vh')
    expect(result).toBe('2px - 2vh')
  })

  it('2vw + (-2vh + 2px)', () => {
    const result = eq('2vw + (-2vh + 2px)')
    expect(result).toBe('2vw - 2vh + 2px')
  })
})

describe('whitespace', () => {
  it('    5px  +   5px  ', () => {
    const result = calc('    5px  +   5px  ')
    expect(result).toBe('10px')
  })

  it('(  5px + 5px )', () => {
    const result = calc('(  5px + 5px )')
    expect(result).toBe('10px')
  })
})

describe('errors', () => {
  it('10sdfs', () => {
    expect(() => calc('10sdfs')).toThrow()
  })

  it('undefinedpx', () => {
    expect(() => calc(`${undefined}px`)).toThrow()
  })

  it('50booger + 60px', () => {
    expect(() => calc('50booger + 60px')).toThrow()
  })

  it('vh + -60px', () => {
    expect(() => calc('vh + -60px')).toThrow()
  })

  it('50vh + + -60px', () => {
    expect(() => calc('50vh + + -60px')).toThrow()
  })

  it('50vh +  + -60px', () => {
    expect(() => calc('50vh +  + -60px')).toThrow()
  })

  it('50vh+ + -60px', () => {
    expect(() => calc('50vh+ + -60px')).toThrow()
  })

  it('50vh ++ -60px', () => {
    expect(() => calc('50vh ++ -60px')).toThrow()
  })

  it('50vh 50vh + -60px', () => {
    expect(() => calc('50vh 50vh + -60px')).toThrow()
  })

  it('50vh50vh + -60px', () => {
    expect(() => calc('50vh50vh + -60px')).toThrow()
  })

  it('50vh + (50vh', () => {
    expect(() => calc('50vh + (50vh')).toThrow()
  })

  it('50vh + 50vh)', () => {
    expect(() => calc('50vh + 50vh)')).toThrow()
  })

  it('50vh) ) + 50vh', () => {
    expect(() => calc('50vh + 50vh)')).toThrow()
  })

  it(')50vh( + 50vh', () => {
    expect(() => calc(')50vh( + 50vh')).toThrow()
  })

  it(')50vh + 50vh', () => {
    expect(() => calc(')50vh + 50vh')).toThrow()
  })

  it('0vh + ()', () => {
    expect(() => calc('0vh + ()')).toThrow()
  })

  it('(5px * 12) (+ 5px * 12)', () => {
    expect(() => calc('(5px * 12) (+ 5px * 12)')).toThrow()
  })

  it('(5px * 12) (5px * 12)', () => {
    expect(() => calc('(5px * 12) (5px * 12)')).toThrow()
  })
})

describe('addition', () => {
  it('0vh + 0px', () => {
    const result = calc('0vh + 0px')
    expect(result).toBe('0')
  })

  it('10px + 0', () => {
    const result = calc('10px + 0')
    expect(result).toBe('10px')
  })

  it('0px + 0px', () => {
    const result = calc('0px + 0px')
    expect(result).toBe('0')
  })

  it('50vh + -60px', () => {
    const result = calc('50vh + -60px')
    expect(result).toBe('calc(50vh - 60px)')
  })

  it('0vh + -95.23px', () => {
    const result = calc('0vh + -95.23px')
    expect(result).toBe('-95.23px')
  })

  it('10px + -95.23px', () => {
    const result = calc('10px + -95.23px')
    expect(result).toBe('-85.23px')
  })

  it('50vh+-60px', () => {
    const result = calc('50vh+-60px')
    expect(result).toBe('calc(50vh - 60px)')
  })

  it('-95.23px + 10px', () => {
    const result = calc('-95.23px + 10px')
    expect(result).toBe('-85.23px')
  })

  it('20px + 20px', () => {
    const result = calc('20px + 20px')
    expect(result).toBe('40px')
  })

  it('20vh + 20px', () => {
    const result = calc('20vh + 20px')
    expect(result).toBe('calc(20vh + 20px)')
  })

  it('20px + 20px + 20px', () => {
    const result = calc('20px + 20px + 20px')
    expect(result).toBe('60px')
  })

  it('20vh + 20px + 20px', () => {
    const result = calc('20vh + 20px + 20px')
    expect(result).toBe('calc(20vh + 40px)')
  })

  it('20px + 20vh + 20px', () => {
    const result = calc('20px + 20vh + 20px')
    expect(result).toBe('calc(40px + 20vh)')
  })

  it('20vh + 20vw + 20px', () => {
    const result = calc('20vh + 20vw + 20px')
    expect(result).toBe('calc(20vh + 20vw + 20px)')
  })

  it('20px + 20px + 20vh', () => {
    const result = calc('20px + 20px + 20vh')
    expect(result).toBe('calc(40px + 20vh)')
  })

  it('20vh + 20vw + -20px', () => {
    const result = calc('20vh + 20vw + -20px')
    expect(result).toBe('calc(20vh + 20vw - 20px)')
  })

  it('20% + 20px + 20vh + 20vw + 20px', () => {
    const result = calc('20% + 20px + 20vh + 20vw + 20px')
    expect(result).toBe('calc(20% + 40px + 20vh + 20vw)')
  })

  it('20% + 20px + 20vh + 20vw + -20px', () => {
    const result = calc('20% + 20px + 20vh + 20vw + -20px')
    expect(result).toBe('calc(20% + 20vh + 20vw)')
  })

  it('20px + 10', () => {
    expect(() => calc('20px + 10')).toThrow()
  })

  // add non-unit to equation
  it('(2em + 2rem) + 2', () => {
    expect(() => calc('(2em + 2rem) + 2')).toThrow()
  })

  // add non-unit to equation
  it('2 + (2em + 2rem)', () => {
    expect(() => calc('2 + (2em + 2rem)')).toThrow()
  })
})

describe('subtraction', () => {
  it('50px - 0', () => {
    const result = calc('50px - 0')
    expect(result).toBe('50px')
  })

  it('0 - 50px', () => {
    const result = calc('0 - 50px')
    expect(result).toBe('-50px')
  })

  it('50px - 50px', () => {
    const result = calc('50px - 50px')
    expect(result).toBe('0')
  })

  it('50vh - -60px', () => {
    const result = calc('50vh - -60px')
    expect(result).toBe('calc(50vh + 60px)')
  })

  it('50vh--60px', () => {
    const result = calc('50vh--60px')
    expect(result).toBe('calc(50vh + 60px)')
  })

  it('50vh - 50px - 50px', () => {
    const result = calc('50vh - 50px - 50px')
    expect(result).toBe('calc(50vh - 100px)')
  })

  it('50px - 50vh - 50px', () => {
    const result = calc('50px - 50vh - 50px')
    expect(result).toBe('-50vh')
  })

  it('50px - 50px - 50vh', () => {
    const result = calc('50px - 50px - 50vh')
    expect(result).toBe('-50vh')
  })

  it('20vh - 20vw - 20px', () => {
    const result = calc('20vh - 20vw - 20px')
    expect(result).toBe('calc(20vh - 20vw - 20px)')
  })

  it('20vh - 20vw - -20px', () => {
    const result = calc('20vh - 20vw - -20px')
    expect(result).toBe('calc(20vh - 20vw + 20px)')
  })

  it('0vh - 95.23px', () => {
    const result = calc('0vh - 95.23px')
    expect(result).toBe('-95.23px')
  })

  it('0vh - -95.23px', () => {
    const result = calc('0vh - -95.23px')
    expect(result).toBe('95.23px')
  })

  it('5px - 50px', () => {
    const result = calc('5px - 50px')
    expect(result).toBe('-45px')
  })

  it('5vh - 50px', () => {
    const result = calc('5vh - 50px')
    expect(result).toBe('calc(5vh - 50px)')
  })

  // subtract equation
  it('5vh - (5em + 5rem)', () => {
    const result = calc('5vh - (5em + 5rem)')
    expect(result).toBe('calc(5vh - 5em - 5rem)')
  })

  // subtract equation
  it('5vh - (-5em - -5rem)', () => {
    const result = calc('5vh - (-5em - -5rem)')
    expect(result).toBe('calc(5vh + 5em - 5rem)')
  })
})

describe('multiplication', () => {
  it('50px * 0', () => {
    const result = calc('50px * 0')
    expect(result).toBe('0')
  })

  it('50px * 1', () => {
    const result = calc('50px * 1')
    expect(result).toBe('50px')
  })

  it('50px * 5', () => {
    const result = calc('50px * 5')
    expect(result).toBe('250px')
  })

  it('50px * -5', () => {
    const result = calc('50px * -5')
    expect(result).toBe('-250px')
  })

  it('50px * 5 * 5', () => {
    const result = calc('50px * 5 * 5')
    expect(result).toBe('1250px')
  })

  it('50px * 2.3333', () => {
    const result = calc('50px * 2.3333')
    expect(result).toBe((`${50 * 2.3333}px`))
  })

  it('50px * 50px', () => {
    expect(() => calc('50px * 50px')).toThrow()
  })
})

describe('division', () => {
  it('50px / 1', () => {
    const result = calc('50px / 1')
    expect(result).toBe('50px')
  })

  it('50px / 5', () => {
    const result = calc('50px / 5')
    expect(result).toBe('10px')
  })

  it('50px / 1.1312', () => {
    const result = calc('50px / 1.1312')
    expect(result).toBe((`${50 / 1.1312}px`))
  })

  it('50px / 5 / 5', () => {
    const result = calc('50px / 5 / 5')
    expect(result).toBe('2px')
  })

  it('50px / (5 / 5)', () => {
    const result = calc('50px / (5 / 5)')
    expect(result).toBe('50px')
  })

  it('0 / 50', () => {
    const result = calc('0px / 50')
    expect(result).toBe('0')
  })

  it('0px / 50', () => {
    const result = calc('0px / 50')
    expect(result).toBe('0')
  })

  it('50px / 0', () => {
    expect(() => calc('50px / 0')).toThrow()
  })

  it('50px / 50px', () => {
    expect(() => calc('50px / 50px')).toThrow()
  })

  // divide equation
  it('(5px + 5vh) / 5', () => {
    const result = calc('(5px + 5vh) / 5')
    expect(result).toBe('calc(1px + 1vh)')
  })

  // divide by equation
  it('50px / (5px + 5rem)', () => {
    expect(() => calc('50px / (5px + 5rem)')).toThrow()
  })
})

describe('equations', () => {
  it('20px * 3 + 5px', () => {
    const result = calc('20px * 3 + 5px')
    expect(result).toBe('65px')
  })

  it('(50vh * 5) + (20px * 6)', () => {
    const result = calc(`(50vh * 5) + (20px * 6)`)
    expect(result).toBe('calc(250vh + 120px)')
  })

  it('(10vh * 5) + (20px * 4)', () => {
    const result = calc(`(10vh * 5) + (20px * 4)`)
    expect(result).toBe('calc(50vh + 80px)')
  })

  it('(20vh * 3) + (20px * 2)', () => {
    const result = calc(`(20vh * 3) + (20px * 2)`)
    expect(result).toBe('calc(60vh + 40px)')
  })

  it('((20vh * 3) + (20px * 2)) * 9 / 16', () => {
    const result = calc(`((20vh * 3) + (20px * 2)) * (9 / 16)`)
    expect(result).toBe('calc(33.75vh + 22.5px)')
  })

  it('(3y + 5x * 12) + 3y * 9 / 3', () => {
    const result = calc('(3px + 5vh * 12) + 3px * 9 / 3')
    expect(result).toBe('calc(12px + 60vh)')
  })

  // non unit number first
  it('7*8px', () => {
    const result = calc('8*8px')
    expect(result).toBe('64px')
  })

  it('(1em + 1rem) + (1px + 1vh)', () => { // equation on both sides
    const result = calc('(1em + 1rem) + (1px + 1vh)')
    expect(result).toBe('calc(1em + 1rem + 1px + 1vh)')
  })

  it('(1em + 1rem) + (1px - 2vh)', () => {
    const result = calc('(1em + 1rem) + (1px - 2vh)')
    expect(result).toBe('calc(1em + 1rem + 1px - 2vh)')
  })

  it('(1em + 1rem) * (1px + 1vh)', () => {
    expect(() => calc('(1em + 1rem) * (1px + 1vh)')).toThrow()
  })
})

describe('calc with error', () => {
  it('should return null for an invalid equation when options.throws === false', () => {
    expect(calc({ throws: false }, '1px * 1px')).toBeNull()
  })
})
