import {
  EqItem,
  PRECEDENCE,
  isOperator,
  isValidUnit,
  charIsReserved,
  hasMoreThanOnePeriod
} from './utils'

import { calculate } from './math'

import { stringify } from './stringify'

import { throwForInvalidSequence } from './verify'

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

/*
These functions parse math equations using the algorithm described here:
http://eli.thegreenplace.net/2012/08/02/parsing-expressions-by-precedence-climbing
*/

/**
 * @param {object} opts
 * @param {string} input
 * @return {string}
 */
function reduceEquation (opts, input) {
  if (!input) {
    return ''
  }

  let result
  const normalized = normalizeInputEquation(input)
  try {
    const tokens = tokenize(normalized, opts.units)
    const tokenizer = new Tokenizer(tokens)
    result = computeExpr(tokenizer, 1, [])
  } catch (e) {
    if (opts.throws) {
      throw e
    }

    return null
  }

  result = stringify(result)
  return result
}

class Tokenizer {
  /**
   * @param {Equation} tokens
   */
  constructor (tokens) {
    this.tokens = tokens
    this.current = tokens[this.index = 0]
  }

  next () {
    this.current = this.tokens[++this.index]
    return this
  }
}

/**
 * @param {string} input
 * @param {array<string>|false} units - supported units (or false to skip this check)
 * @throws if the opening/closing parentheses do not match
 *         or two consecutive tokens do not form a valid sequence
 * @return {array}
 */
function tokenize (input, units) {
  let token
  let parens = 0
  const result = []
  // regex capturing groups:
  //   match[0] === equation item value
  //   match[1] === equation item unit
  //   match[3] === unit with no preceding number
  //   match[4] === reserved char
  //   match[5] === catch all if no valid matches were found
  //                used exclusively to check for invalid strings
  const regex = /\s*(?:([+-]?[\d|.]+)(%|[a-z]*)|([a-z%]+)|([()+*/-]))\s*|(.)/gi
  while ((token = validNextToken(regex, input, token, units))) {
    parens += token === '(' ? 1 : token === ')' ? -1 : 0
    if (parens < 0) break
    result.push(token)
  }

  if (parens !== 0) {
    throw new Error('Parentheses do not match!')
  }

  return result
}

/**
 * @param {RegExp} regex - for generating tokens
 * @param {string} input - output from normalizeInputEquation
 * @param {EquationItem|string|undefined} prevToken
 * @param {array<string>} units - (optional) supported unit types
 * @return {EquationItem|string|undefined}
 */
function validNextToken (regex, input, prevToken, units) {
  const token = nextToken(regex, input, units)
  if (token === null) {
    throw new Error(`Invalid input: ${input.substring(regex.lastIndex - 1)}`)
  }

  return throwForInvalidSequence(prevToken, token)
}

/**
 * @param {RegExp} regex - for generating tokens
 * @param {string} input - output from normalizeInputEquation
 * @param {array<string>} units - (optional) supported unit types
 * @throws for invalid equation items
 *         and unsupported unit types if a units array is provided
 * @return {EquationItem|string|null|undefined} null signifies invalid input
 */
function nextToken (regex, input, units) {
  let token
  const match = regex.exec(input)
  if (!match) {
    return token
  }

  // this matches when the string input is not valid
  if (match[5]) {
    return null
  }

  if (match[3]) {
    throw new Error('Letters and/or % with no preceding number!')
  }

  if (charIsReserved(match[4])) {
    return match[4]
  }

  const value = Number.parseFloat(match[1])
  // Number.isNaN catches operands that only have letters (like "undefinedpx")
  // hasMoreThanOnePeriod catches operands with more than one decimal (like "5.5.5px")
  if (Number.isNaN(value) || hasMoreThanOnePeriod(match[1])) {
    throw new Error(`"${stringify(match[0]).trim()}" is not a valid operand!`)
  }

  const unit = match[2]
  if (units && !isValidUnit(units, unit)) {
    throw new Error(`"${unit}" is not a supported unit type!`)
  }

  return EqItem(value, unit)
}

/**
 * @param {Tokenizer} tokenizer
 * @param {number} minPrecedence
 * @return {Equation|EquationItem}
 */
function computeExpr (tokenizer, minPrecedence) {
  let token
  let lhs = atomize(tokenizer)
  while ((token = tokenizer.current) && PRECEDENCE[token] >= minPrecedence) {
    const rhs = computeExpr(tokenizer.next(), PRECEDENCE[token] + 1)
    lhs = calculate(lhs, token, rhs)
  }

  return lhs
}

/**
 * @param {Tokenizer} tokenizer
 * @return {Equation|EquationItem}
 */
function atomize (tokenizer) {
  let token = tokenizer.current
  if (token !== '(') {
    tokenizer.next()
    return token
  }

  token = computeExpr(tokenizer.next(), 1)
  tokenizer.next() // skip the ')'
  return token
}

/**
 * normalize input before tokenizing:
 *   1. replace "- (" with "- 1 * ("
 *   2. find sequences that are difficult to interpret with the tokenizer regex
 * this does NOT try to fix invalid sequences - the tokenizer will catch those later
 * instead it transforms valid sequences that are tricky for the tokenizer to detect,
 * mostly because certain tokens are treated differently based on what precedes them
 * @param {string} input
 * @return {string}
 */
function normalizeInputEquation (input) {
  // regex capturing groups:
  //   a  - [^\s(]  non-whitespace character other than (
  //   _w - \s*     optional whitespace
  //   c  - [+-]    + or -
  //   t  - [\d|(]  digit or (
  return input.toLowerCase()
    .replace(/([^\s(])(\s*)([+-])([\d|(])/gi, (m, a, _w, b, t) => {
      let w = _w
      if (isOperator(a)) {
        w = w || ' '
        if (b === '+') { // if + follows another operator, remove it
          return a + w + t // 2 ++2 -> 2 + 2
        } else if (b === '-' && t === '(') { // make it possible to evaluate -(2)
          // something like 5 -(5) is not changed here because isOperator(a) would === false
          return a + w + '-1 * ' + t // 2 +-(2) -> 2 + -1 * (2)
        }

        // default: make sure there's whitespace between two operators
        return a + w + b + t
      }

      // 2 +2 -> 2 + 2
      // 2 -2 -> 2 - 2
      // otherwise the tokenizer won't recognizer the +|- as an operator
      // (it will think it's part of the number, like positive or negative two)
      return a + w + b + ' ' + t
    })
}

export {
  reduceEquation,
  Tokenizer,
  tokenize,
  validNextToken,
  nextToken,
  computeExpr,
  atomize,
  normalizeInputEquation
}
