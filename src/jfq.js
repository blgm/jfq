import readInput from 'read-input'
import parseJson from 'parse-json'
import minimist from 'minimist'

const opts = minimist(process.argv.slice(2))
const suppressNewline = !!opts.n
const fileNames = opts._

readInput(fileNames)
  .then(res => {
    const json = parseJson(res.data)
    const formatted = suppressNewline ? JSON.stringify(json) : JSON.stringify(json, null, 2)
    console.log(formatted)
  })
  .catch(err => console.error('failed: ' + err))
