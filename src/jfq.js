import colorize from 'json-colorizer'
import jsonata from 'jsonata'
import parseJson from 'parse-json'
import readInput from 'read-input'
import getopts from './getopts'

getopts(process.argv)
  .then(res => {
    const {query, files, ndjson} = res
    try {
      const evaluator = jsonata(query)
      return {evaluator, files, ndjson}
    } catch (err) {
      throw new Error('Failed to compile JSONata expression: ' + err.message)
    }
  })
  .then(res => {
    const {evaluator, files, ndjson} = res

    return readInput(files)
      .then(res => {
        const input = parseJson(res.data)
        const output = evaluator.evaluate(input)
        console.log(format(output, ndjson))
      })
  })
  .catch(err => {
    console.error(err.message)
    process.exit(1)
  })

const format = (data, ndjson) => {
  if (typeof data === 'string') {
    return data
  } else if (isSimpleArray(data)) {
    return data.join('\n')
  } else {
    const formatted = ndjson ? JSON.stringify(data) : JSON.stringify(data, null, 2)
    return colorize(formatted)
  }
}

// Is it an array containing only simple types
const isSimpleArray = arr => Array.isArray(arr) && !arr.some(i => typeof i !== 'string' && typeof i !== 'number')
