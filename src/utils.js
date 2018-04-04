/**
 * @typedef {object} EquationItem
 * @property {number} value - Item value
 * @property {string} unit - Unit type (or '' if the value has no unit)
 */

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
const PRECEDENCE = {
  '*': 14,
  '/': 14,
  '+': 13,
  '-': 13
}

const IS_OP_REGEX = /^[-+*/]$/

const IS_EQUATION_REGEX = /[()]|(?:[^\s]\s*[+\-*/])/

const RESERVED_CHARS = ['+', '-', '*', '/', '(', ')']

/**
 * @param {string} input
 * @return {boolean}
 */
function isOperator (input) {
  return input ? IS_OP_REGEX.test(input) : false
}

/**
 * @param {*} input
 * @return {boolean}
 */
function isOperand (input) {
  return input ? input.hasOwnProperty('value') && input.hasOwnProperty('unit') : false
}

/**
 * @param {*} input
 * @return {boolean}
 */
function isEquation (input) {
  return Array.isArray(input)
}

/**
 * @param {string} input
 * @return {boolean}
 */
function stringIsEquation (input) {
  return IS_EQUATION_REGEX.test(input)
}

/**
 * @param {string} input
 * @return {string}
 */
function getItemType (input) {
  return (isOperand(input) && 'operand') || (isOperator(input) && 'operator') || input
}

/**
 * @param {EquationItem} a
 * @param {EquationItem} b
 * @return {boolean}
 */
function haveSameUnit (a, b) {
  return a.unit === b.unit
}

/**
 * @param {EquationItem} input
 * @return {EquationItem}
 */
function hasNoUnit (input) {
  return !input.unit
}

/**
 * @param {array<string>} units
 * @param {string} unit
 * @return {boolean}
 */
function isValidUnit (units, unit) {
  return unit === '' || units.indexOf(unit) !== -1
}

/**
 * @param {string} input
 * @return {boolean}
 */
function isParenthesis (input) {
  return input === '(' || input === ')'
}

/**
 * @param {string} char
 * @return {boolean}
 */
function charIsReserved (char) {
  return RESERVED_CHARS.indexOf(char) !== -1
}

/**
 * @param {number} value
 * @param {string} unit
 * @return {EquationItem}
 */
function EqItem (value = 0, unit = '') {
  return removeUnitIfZero({ value, unit })
}

/**
 * @return {EquationItem}
 */
function zero () {
  return { value: 0, unit: '' }
}

/**
 * @param {EquationItem} input
 * @return {EquationItem}
 */
function removeUnitIfZero (input) {
  return input && !input.value ? zero() : input
}

/**
 * @param {EquationItem} input
 * @return {EquationItem}
 */
function opposite (input) {
  return EqItem(input.value * -1, input.unit)
}

/**
 * @param {EquationItem} input
 * @return {EquationItem}
 */
function inverse (input) {
  return EqItem(1 / input.value, input.unit)
}

/**
 * @param {string} input
 * @return {boolean}
 */
function hasMoreThanOnePeriod (input) {
  return input.indexOf('.', input.indexOf('.') + 1) !== -1
}

export {
  PRECEDENCE,
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
  inverse,
  hasMoreThanOnePeriod
}
