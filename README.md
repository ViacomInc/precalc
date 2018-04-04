# Precalc

[![Build Status](https://travis-ci.org/ViacomInc/precalc.svg?branch=master)](https://travis-ci.org/ViacomInc/precalc) [![codecov](https://codecov.io/gh/ViacomInc/precalc/branch/master/graph/badge.svg)](https://codecov.io/gh/ViacomInc/precalc) ![size](http://img.badgesize.io/https://unpkg.com/precalc?label=size&style=flat-square) ![gzip size](http://img.badgesize.io/https://unpkg.com/precalc?compression=gzip&label=gzip%20size&style=flat-square) ![module formats: umd, cjs, and es](https://img.shields.io/badge/module%20formats-umd%2C%20cjs%2C%20es-green.svg?style=flat-square) [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Simplify CSS equations with mixed units and wrap them in [calc](https://developer.mozilla.org/en-US/docs/Web/CSS/calc).

```javascript
const num = 5

calc(`${num}px * 5 + 20px`)
// '45px' (calc is not required)

calc(`${num}% * 5 + 20px`)
// 'calc(25% + 20px)`

calc('(2vh * (9)) / 3 * 4 + -(4vh) - 10px')
// 'calc(20vh - 10px)'
```

## API

### `calc([opts], input)`

* `opts` (object) - optional config

  * calc also supports currying when *opts* are passed without *input*

  * **units** (array\<string> | boolean) - *default: false*

    * validate the unit types in the input equation

    * **array** - if the equation has units that are not in the array, throw an error

    * **true** - valdate against **vh**, **vw**, **px**, **%**, **em**, **rem**

    * **false** - do not validate units

  * **throws** (boolean) - *default: true*

    * throw errors for malformed equations

    * when false, `eq` and `calc` return null for invalid input

* `input` (string) - css equation

  * supported operators: **+** **-** **/** **\***

```js
// this works...
calc('5px + 10px')

// and this works...
calc({ throws: false }, '5px + 10px')

// and this...
calc = calc({ throws: false })

// ...works too!
calc('5px + 10px') // evaluates with throws: false
```

### `eq([opts], input)`

just like `calc`, but without the word "calc" in the output

```javascript
const num = 5

eq(`${num}px * 5 + 20px`)
// '45px'

eq(`${num}% * 5 + 20px`)
// '25% + 20px`
```

### `wrapInCalc(input)`

wraps the input with "calc" if necessary

* `input` (string) - css equation

```javascript
wrapInCalc('50%')
// '50%'

wrapInCalc('50% + 25px')
// 'calc(50% + 25px)'
```

in fact, `calc` is just shorthand for `eq` and `wrapInCalc` together:

```js
function calc(...args) {
  return wrapInCalc(eq.apply(null, args))
}
```

## Example

### generating 16x9 height and width

```javascript
const columns = 2
const ratio = '9 / 16'

let width = eq(`20vw * ${columns} + 10px * ${columns}`)
// input:  '20vw * 2 + 10px * 2'
// output: '40vw + 20px'

const height = calc(`(${width}) * (${ratio})`)
// input:  '(40vw + 20px) * (9 / 16)'
// output: 'calc(22.5vw + 11.25px)'

width = wrapInCalc(width)
// input:  '40vw + 20px'
// output: 'calc(40vw + 20px)'
```

To see examples of valid input, check **index.test.js**.

## Input Errors

* Non-matching parentheses

* Letters or "%" character with no preceding number

* Unsupported unit types (unless `opts.units` is false)

* Input with chars that are not \+ - * / % ( ) digits or letters

* Adding or subtracting a number with units to a number without units

* Multiplying two numbers that both have units

* Dividing by a number with units

* Dividing by zero
