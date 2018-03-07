import fileExists from 'file-exists'
import program from 'commander'

export default async argv => {
  program
    .option('-n, --ndjson', 'Newline Delimited JSON')
    .option('-j, --json', 'Force JSON output')
    .option('-y, --yaml', 'YAML output')
    .option('-a, --accept-yaml', 'YAML input')
    .parse(argv)

  const ndjson = !!program.ndjson
  const json = !!program.json
  const yamlOut = !!program.yaml
  const yamlIn = !!program.acceptYaml
  const files = program.args.slice(0)

  // If the first argument is a file that exists, then it was not a query string
  // If the first argument is not defined, then it was not a query string
  const isNotQuery = files[0] ? await fileExists(files[0]) : true
  var query = isNotQuery ? '$' : files.shift()
  return {query, files, ndjson, json, yamlOut, yamlIn}
}
