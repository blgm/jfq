import babel from 'rollup-plugin-babel'

export default {
  input: 'src/jfq.js',
  output: {
    file: 'bin/jfq.js',
    format: 'cjs',
    banner: '#!/usr/bin/env node'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ],
  external: [
    'commander',
    'file-exists',
    'fs-readfile-promise',
    'jsonata',
    'json-colorizer',
    'js-yaml',
    'parse-json',
    'read-input',
    'line-reader'
  ]
}
