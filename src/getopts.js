import fileExists from 'file-exists'
import program from 'commander'

export default argv => {
  program
    .option('-n, --ndjson', 'Newline Delimited JSON')
    .option('-j, --json', 'Force JSON output')
    .option('-y, --yaml', 'YAML output')
    .parse(argv)

  const ndjson = !!program.ndjson
  const json = !!program.json
  const yaml = !!program.yaml
  const files = program.args.slice(0)

  return Promise.resolve()
    .then(() => {
      // If the first argument is a file that exists, then it was not a query string
      // If the first argument is not defined, then it was not a query string
      return files[0] ? fileExists(files[0]) : true
    })
    .then(isNotQuery => {
      var query = isNotQuery ? '$' : files.shift()
      return {query, files, ndjson, json, yaml}
    })
}
