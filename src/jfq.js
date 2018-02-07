import colorize from 'json-colorizer'
import jsonata from 'jsonata'
import parseJson from 'parse-json'
import readInput from 'read-input'
import getopts from './getopts'

getopts(process.argv)
  .then(res => {
    const {query, files, ndjson} = res
    const evaluator = jsonata(query)

    return readInput(files)
      .then(res => {
        const input = parseJson(res.data)
        const output = evaluator.evaluate(input)
        const formatted = ndjson ? JSON.stringify(output) : JSON.stringify(output, null, 2)
        console.log(colorize(formatted))
      })
  })
  .catch(err => console.error('failed: ' + err))
