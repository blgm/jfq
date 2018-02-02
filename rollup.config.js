export default {
  input: 'src/jfq.js',
  output: {
    file: 'bin/jfq.js',
    format: 'cjs',
    banner: '#!/usr/bin/env node'
  },
  external: [
    'jsonata',
    'minimist',
    'parse-json',
    'read-input'
  ]
}
