const { eq, calc } = require('./dist/precalc.js')

run(process.argv.slice(2))

function run (args) {
  if (args.length === 0) {
    console.log('No input provided!')
    return
  }

  const { wrapInCalc, input } = parseArgs(args)
  const fn = wrapInCalc ? calc : eq
  try {
    const output = fn(input)
    console.log(output)
  } catch (e) {
    console.log(e.message)
  }
}

function parseArgs (args) {
  let wrapInCalc
  if (args[0] === 'true') {
    wrapInCalc = true
  } else if (args[0] === 'false') {
    wrapInCalc = false
  } else {
    return { wrapInCalc: false, input: args.join(' ') }
  }

  return { wrapInCalc, input: args.slice(1).join(' ') }
}
