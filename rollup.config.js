import pkg from './package.json'
import buble from 'rollup-plugin-buble'
import multiEntry from 'rollup-plugin-multi-entry'

let config
if (process.env.TEST_BUILD) {
  config = [{
    input: {
      include: ['src/*.js'],
      exclude: ['src/index.js']
    },
    output: {
      file: 'test/precalc-test.js',
      format: 'cjs'
    },
    sourcemap: 'inline',
    plugins: [
      multiEntry(),
      buble({
        transforms: {
          modules: false
        }
      })
    ]
  }]
} else {
  config = [{
    input: 'src/index.js',
    name: 'precalc', // for umd build
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
      { file: pkg.browser, format: 'umd' }
    ],
    plugins: [
      buble({ transforms: { modules: false } })
    ]
  }]
}

export default config
