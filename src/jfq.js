import colorize from 'json-colorizer'
import jsonata from 'jsonata'
import parseJson from 'parse-json'
import program from 'commander'
import readInput from 'read-input'

program
  .option('-n, --ndjson', 'Newline Delimited JSON')
  .parse(process.argv)

const suppressNewline = !!program.ndjson
const fileNames = program.args.slice(0)
const query = fileNames.shift()

const evaluator = jsonata(typeof query === 'string' && query.length ? query : '$')

readInput(fileNames)
  .then(res => {
    const input = parseJson(res.data)
    const output = evaluator.evaluate(input)
    const formatted = suppressNewline ? JSON.stringify(output) : JSON.stringify(output, null, 2)
    console.log(colorize(formatted))
  })
  .catch(err => console.error('failed: ' + err))
