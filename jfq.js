import readInput from 'read-input'
import parseJson from 'parse-json'

const fileNames = process.argv.slice(2)

readInput(fileNames)
  .then(res => {
    const json = parseJson(res.data)
    console.log(JSON.stringify(json, null, 2))
  })
  .catch(err => console.error('failed: ' + err))
