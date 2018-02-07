export default {
  input: 'src/jfq.js',
  output: {
    file: 'bin/jfq.js',
    format: 'cjs',
    banner: '#!/usr/bin/env node'
  },
  external: [
    'commander',
    'file-exists',
    'jsonata',
    'json-colorizer',
    'parse-json',
    'read-input'
  ]
}
