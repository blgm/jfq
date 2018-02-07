import colorize from 'json-colorizer'
import jsonata from 'jsonata'
import parseJson from 'parse-json'
import readInput from 'read-input'
import getopts from './getops'

const {query, files, ndjson} = getopts(process.argv)

const evaluator = jsonata(query)

readInput(files)
  .then(res => {
    const input = parseJson(res.data)
    const output = evaluator.evaluate(input)
    const formatted = ndjson ? JSON.stringify(output) : JSON.stringify(output, null, 2)
    console.log(colorize(formatted))
  })
  .catch(err => console.error('failed: ' + err))
