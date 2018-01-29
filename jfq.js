import readInput from 'read-input'

const fileNames = process.argv.slice(2)

readInput(fileNames)
  .then(res => console.log(res.data))
  .catch(err => console.err('failed: ' + err))
