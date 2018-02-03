import colorize from 'json-colorizer'
import jsonata from 'jsonata'
import minimist from 'minimist'
import parseJson from 'parse-json'
import readInput from 'read-input'

const opts = minimist(process.argv.slice(2))
const suppressNewline = !!opts.n
const query = opts._.shift()
const fileNames = opts._

const evaluator = jsonata(typeof query === 'string' && query.length ? query : '$')

readInput(fileNames)
  .then(res => {
    const input = parseJson(res.data)
    const output = evaluator.evaluate(input)
    const formatted = suppressNewline ? JSON.stringify(output) : JSON.stringify(output, null, 2)
    console.log(colorize(formatted))
  })
  .catch(err => console.error('failed: ' + err))
