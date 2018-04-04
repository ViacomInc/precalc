import {
  isEquation,
  haveSameUnit,
  hasNoUnit,
  EqItem,
  zero,
  inverse,
  opposite
} from './utils'

import { stringify } from './stringify'

const OPERATORS = {
  '+': add,
  '-': subtract,
  '*': multiply,
  '/': divide
}

/**
 * @typedef {object} EquationItem
 * @property {number} value - Item value
 * @property {string} unit - Unit type (or '' if the value has no unit)
 */

/**
 * @typedef {array<EquationItem|string>} Equation
 * alternates between EquationItems and op strings like '+', '-', '*', '/'
 * the first and last items should be EquationItems
 */

/********************************************************************************************
    A FEW NOTES:

1.  add, subtract, multiply, and divide should not be called directly
    use the calculate function instead

2.  equation arrays and equation items should be considered immutable
    to change an item's value or unit, use the item function to create a new one
********************************************************************************************/

/**
 * @param {Equation|EquationItem} lhs
 * @param {string} op
 * @param {Equation|EquationItem} rhs
 * @return {Equation|EquationItem}
 */
function calculate (lhs, op, rhs) {
  const opFn = OPERATORS[op]
  return opFn(lhs, rhs)
}

/**
 * tries to simplify two operands within a longer equation
 * @example
 * // returns [10, '-', 5]
 * calculatePartOfEquation([5, '+', 5, '-', 5], 0)
 * // returns [5, '+', 0]
 * calculatePartOfEquation([5, '+', 5, '-', 5], 2)
 * @param {Equation} _eq
 * @param {number} index
 * @return {Equation}
 */
function calculatePartOfEquation (_eq, index) {
  const eq = _eq.slice(0) // clone array
  const subEq = calculate(eq[index], eq[index + 1], eq[index + 2])
  Array.prototype.splice.apply(eq, [index, index + 3, ...subEq])
  return eq
}

/**
 * @param {Equation|EquationItem} lhs
 * @param {Equation|EquationItem} rhs
 * @throws if one operand has a unit but the other one doesn't
 * @return {Equation|EquationItem}
 */
function add (lhs, rhs) {
  let result
  const lhsIsEq = isEquation(lhs)
  const rhsIsEq = isEquation(rhs)
  if (lhsIsEq && rhsIsEq) {
    for (let i = 0; i < rhs.length; i += 2) {
      // assumes the equation only has + or -
      // because we only allow multiplication and division by numbers that don't have units,
      // those operations will be reduced from any equation (or else an error will be thrown)
      lhs = calculate(lhs, rhs[i - 1] || '+', rhs[i])
    }

    result = lhs
  } else if (lhsIsEq && rhs.value) {
    result = addToEquation(lhs, rhs, false)
  } else if (rhsIsEq && lhs.value) {
    result = addToEquation(rhs, lhs, true)
  } else if (!rhs.value) {
    result = lhs
  } else if (!lhs.value) {
    result = rhs
  } else if (hasNoUnit(lhs) ^ hasNoUnit(rhs)) {
    // throw if one operand has a unit but the other one doesn't
    // this check happens after verifying the operands are not equations
    throw new Error(`Unable to add "${stringify(lhs)}" with "${stringify(rhs)}"`)
  } else if (lhs.unit === rhs.unit) {
    result = EqItem(lhs.value + rhs.value, lhs.unit)
  } else if (rhs.value < 0) {
    result = [lhs, '-', opposite(rhs)] // example: 5px + -5vh => 5px - 5vh
  } else {
    result = [lhs, '+', rhs]
  }

  return result
}

/**
 * @param {Equation|EquationItem} lhs
 * @param {Equation|EquationItem} rhs
 * @return {Equation|EquationItem}
 */
function subtract (lhs, rhs) {
  if (isEquation(rhs)) {
    // since 5 - (5 + 5) is the same as 5 + -1 * (5 + 5)
    return add(lhs, calculate(rhs, '*', EqItem(-1, '')))
  }

  // since 5 - 5 is the same as 5 + -5...
  return add(lhs, opposite(rhs))
}

/**
 * @param {Equation|EquationItem} lhs
 * @param {Equation|EquationItem} rhs
 * @throws if divisor is an equation, has a unit, or the value is 0
 * @return {Equation|EquationItem}
 */
function divide (lhs, rhs) {
  if (isEquation(rhs)) {
    throw new Error('Divisor is equation.')
  }

  if (rhs.unit) {
    throw new Error(`Divisor has unit.`)
  }

  if (!rhs.value) {
    throw new Error(`Division by zero.`)
  }

  let result
  if (isEquation(lhs)) {
    result = calculate(lhs, '*', inverse(rhs))
  } else if (lhs.value) {
    result = EqItem(lhs.value / rhs.value, lhs.unit)
  } else {
    result = zero()
  }

  return result
}

/**
 * @param {Equation|EquationItem} lhs
 * @param {Equation|EquationItem} rhs
 * @throws if multiplier has a unit property
 * @return {Equation|EquationItem}
 */
function multiply (lhs, rhs) {
  let lhsIsEq = isEquation(lhs)
  let rhsIsEq = isEquation(rhs)
  if (lhsIsEq && rhsIsEq) {
    throw new Error(`Unable to multiply "${stringify(lhs)}" with "${stringify(rhs)}"`)
  }

  let result
  if ((lhs.unit && rhs.unit) || (lhsIsEq && rhs.unit) || (lhs.unit && rhsIsEq)) {
    throw new Error('Unable to multiply by a number with units!')
  } else if (lhsIsEq) {
    result = multiplyWithEquation(lhs, rhs)
  } else if (rhsIsEq) {
    result = multiplyWithEquation(rhs, lhs)
  } else if (!lhs.value || !rhs.value) {
    result = zero()
  } else {
    result = EqItem(lhs.value * rhs.value, lhs.unit || rhs.unit)
  }

  return result
}

/**
 * @param {Equation} _eq
 * @param {EquationItem} item
 * @return {Equation}
 */
function multiplyWithEquation (_eq, item) {
  let eq = _eq.slice(0) // clone array
  for (let i = 0; i < eq.length; i += 2) {
    // if (eq[i - 1] === '/') break
    eq[i] = calculate(eq[i], '*', item)
    if (i > 1) {
      eq = calculatePartOfEquation(eq, i - 2)
    }
  }

  return eq
}

/**
 * NOTE: when the lhs is an equation, that should mean it was already reduced so
 * it does not contain multiplication or division; otherwise this function would
 * need to account for operator precedence within the equation
 * it also assumes that + and - have the same precedence
 * @param {Equation} _eq
 * @param {EquationItem} item
 * @param {boolean} eqIsRhs - true for item + eq, false for eq + item
 * @return {Equation}
 */
function addToEquation (_eq, item, eqIsRhs) {
  let eq = _eq
  for (let i = 0; i < eq.length; i += 2) {
    if (haveSameUnit(eq[i], item)) {
      eq = eq.slice(0) // clone array
      // without this line, 5px - 5vh + 5vh would be simplified to 5px - 10vh
      const operator = eq[i - 1] === '-' ? '-' : '+'
      eq[i] = calculate(eq[i], operator, item)
      // if eq[i] is zero as a result of the first calculate, this removes it from the equation
      // for example, "5px + 5vh - 5vh" should evaluate to "5px" instead of "5px + 0"
      eq = calculatePartOfEquation(eq, Math.max(0, i - 3))
      return eq
    }
  }

  if (!item.unit) {
    throw new Error(`Unable to add "${stringify(item)}" with "${stringify(eq)}"`)
  }

  if (eqIsRhs) {
    eq = [item, '+'].concat(eq)
    eq = calculatePartOfEquation(eq, 0)
  } else if (item.value < 0) {
    eq = eq.concat('-', opposite(item))
  } else {
    eq = eq.concat('+', item)
  }

  return eq
}

export {
  calculate,
  calculatePartOfEquation,
  add,
  subtract,
  divide,
  multiply,
  multiplyWithEquation,
  addToEquation
}
