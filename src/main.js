import { reduceEquation } from './parser'

import { stringIsEquation } from './utils'

/**
 * @return {object}
 */
const getDefaultOpts = () => ({
  units: ['px', 'vh', 'vw', 'em', 'rem', '%'],
  throws: true
})

/**
 * @param {string} input
 * @return {string}
 */
function wrapInCalc (input) {
  return stringIsEquation(input) ? `calc(${input})` : input
}

/**
 * takes the same parameters as the eq function
 * @throws for invalid input
 * @return {string|object}
 */
function calc (...args) {
  let result = eq.apply(null, args)
  result = wrapInCalc(result)
  return result
}

/**
 * @param {object|string} a
 * @param {string|undefined} b
 * parameter combinations:
 *   <string> - uses default options
 *   <object> <string> - uses custom options
 *   <object> - returns a curried function that takes a string param
 * @throws for invalid input
 * @return {string|object}
 */
function eq (a, b) {
  if (typeof a === 'string') {
    return reduceEquation(getOpts(), a)
  }

  const opts = getOpts(a)
  if (typeof b === 'string') {
    return reduceEquation(opts, b)
  }

  return (input) => reduceEquation(opts, input)
}

/**
 * @param {object} opts
 * @return {object}
 */
function getOpts (opts) {
  const defaults = getDefaultOpts()
  if (!opts) {
    return defaults
  }

  let units
  if (Array.isArray(opts.units)) {
    units = opts.units
  } else if (opts.units === true) {
    units = defaults.units
  } else {
    units = false
  }

  const throws = opts.throws === undefined ? defaults.throws : !!opts.throws
  return { units, throws }
}

export { getDefaultOpts, wrapInCalc, calc, eq, getOpts }
