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
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [['env', {
        'modules': false,
        'targets': {
          'node': '6'
        }
      }]],
      plugins: ['external-helpers']
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
    'read-input'
  ]
}
