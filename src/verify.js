import { getItemType } from './utils'

import { stringify } from './stringify'

/**
 * @typedef {object} EquationItem
 * @property {number} value - Item value
 * @property {string} unit - Unit type (or '' if the value has no unit)
 */

// this assignment stops rollup from complaining about the use of eval
const _eval = eval // eslint-disable-line no-eval

/**
 * @param {string} input
 * @throws if eval throws
 * @return {number}
 */
function evaluate (input) {
  try {
    // remove letters and % characters, then eval away
    return _eval(input.replace(/[a-z%]+/gi, ''))
  } catch (e) {
    return e
  }
}

/**
 * evaluates two equations and compares the result
 * @param {string} original
 * @param {string} reduction
 * @throws if original and reduction do not evaluate to the same result
 * @return {boolean}
 */
function verifyReducedEquation (original, reduction) {
  const val1 = evaluate(original)
  if (val1 instanceof Error) {
    return new Error(`Unable to evaluate the input equation "${original}".`)
  }

  const val2 = evaluate(reduction)
  if (val2 instanceof Error) {
    return new Error(`Unable to evaluate the reduced equation "${reduction}".`)
  }

  if (val1 !== val2) {
    let msg = `The reduced equation "${reduction}" is not correct.`
    msg += `\n - It should evaluate to ${val1} instead of ${val2}.`
    return new Error(msg)
  }

  return val1
}

/**
 * @param {EquationItem|string} currItem
 * @param {EquationItem|string} nextItem
 * @throws if nextItem can't follow currItem in an equation
 * @return {EquationItem|string} - nextItem
 */
function throwForInvalidSequence (currItem, nextItem) {
  const currType = getItemType(currItem)
  const nextType = getItemType(nextItem)
  if (validateTypeSequence(currType, nextType)) {
    return nextItem
  }

  let msg
  const a = stringify(currItem).trim()
  const b = stringify(nextItem).trim()
  if (!a) {
    msg = `equation begins with "${b}"`
  } else if (!b) {
    msg = `equation ends with "${a}"`
  } else if (a === '(' && b === ')') {
    msg = `empty parentheses`
  } else {
    msg = `${a} followed by ${b}`
  }

  throw new Error(`Invalid sequence: ${msg}`)
}

/**
 * @param {string} type1
 * @param {string} type2
 * @return {boolean}
 */
function validateTypeSequence (type1, type2) {
  // type1 is undefined at the start of equation
  // type2 is undefined at the end of equation
  switch (type1) {
    case undefined:
    // fallthrough to case '('
    case 'operator':
      // fallthrough to case '('
    case '(':
      return type2 === 'operand' || type2 === '('
    case 'operand':
      // fallthrough to case ')'
    case ')':
      return type2 === 'operator' || type2 === ')' || type2 === undefined
    default:
      return false
  }
}

export {
  evaluate,
  verifyReducedEquation,
  throwForInvalidSequence,
  validateTypeSequence
}
