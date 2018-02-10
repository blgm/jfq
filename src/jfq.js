import colorize from 'json-colorizer'
import jsonata from 'jsonata'
import parseJson from 'parse-json'
import readInput from 'read-input'
import getopts from './getopts'
import YAML from 'js-yaml'

getopts(process.argv)
  .then(options => {
    try {
      options.evaluator = jsonata(options.query)
      return options
    } catch (err) {
      throw new Error('Failed to compile JSONata expression: ' + err.message)
    }
  })
  .then(options => {
    const {evaluator, files, ndjson, json, yaml} = options

    return readInput(files)
      .then(res => {
        const input = parseJson(res.data)
        const result = evaluator.evaluate(input)
        const output = yaml ? YAML.safeDump(result) : formatJson(result, ndjson, json)
        console.log(output)
      })
  })
  .catch(err => {
    console.error(err.message)
    process.exit(1)
  })

const formatJson = (data, ndjson, json) => {
  if (typeof data === 'undefined') {
    return ''
  }

  if (!json) {
    if (typeof data === 'string') {
      return data
    }

    if (isSimpleArray(data)) {
      return data.join('\n')
    }
  }

  const formatted = ndjson ? JSON.stringify(data) : JSON.stringify(data, null, 2)
  return colorize(formatted)
}

// Is it an array containing only simple types
const isSimpleArray = arr => Array.isArray(arr) && !arr.some(i => typeof i !== 'string' && typeof i !== 'number')
