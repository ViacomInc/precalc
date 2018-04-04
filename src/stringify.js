import { isEquation, isParenthesis } from './utils'

/**
 * @typedef {object} EquationItem
 * @property {number} value - Item value
 * @property {string} unit - Unit type (or '' if the value has no unit)
 */

/**
  * @param {array|object} input
  * @return {string}
  */
function stringify (input) {
  if (isEquation(input)) {
    return stringifyEquation(input)
  }

  return stringifyEquationItem(input)
}

/**
 * @param {array} input
 * @return {string}
 */
function stringifyEquation (input) {
  const result = input.reduce((acc, item) => {
    if (isEquation(item)) {
      return `${acc}(${stringifyEquation(item)})`
    }

    return `${acc}${stringifyEquationItem(item)}`
  }, '')

  return result
}

/**
 * @param {string|EquationItem} item
 * @return {string}
 */
function stringifyEquationItem (item) {
  let result
  if (!item) {
    result = ''
  } else if (isParenthesis(item)) {
    result = item
  } else if (typeof item === 'string') {
    result = ` ${item} `
  } else {
    result = `${item.value}${item.unit}`
  }

  return result
}

export { stringify, stringifyEquation, stringifyEquationItem }
