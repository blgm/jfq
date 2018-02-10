import colorize from 'json-colorizer'
import jsonata from 'jsonata'
import parseJson from 'parse-json'
import readInput from 'read-input'
import getopts from './getopts'

getopts(process.argv)
  .then(res => {
    const {query, files, ndjson, json} = res
    try {
      const evaluator = jsonata(query)
      return {evaluator, files, ndjson, json}
    } catch (err) {
      throw new Error('Failed to compile JSONata expression: ' + err.message)
    }
  })
  .then(res => {
    const {evaluator, files, ndjson, json} = res

    return readInput(files)
      .then(res => {
        const input = parseJson(res.data)
        const output = evaluator.evaluate(input)
        console.log(format(output, ndjson, json))
      })
  })
  .catch(err => {
    console.error(err.message)
    process.exit(1)
  })

const format = (data, ndjson, json) => {
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
