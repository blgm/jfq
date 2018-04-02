import fileExists from 'file-exists'
import program from 'commander'
import readFilePromise from 'fs-readfile-promise'

export default async argv => {
  program
    .option('-a, --accept-yaml', 'YAML input')
    .option('-j, --json', 'Force JSON output')
    .option('-n, --ndjson', 'Newline Delimited JSON')
    .option('-q, --query-file <path>', 'JSONata query file')
    .option('-s, --spread', 'Spread output into files')
    .option('-y, --yaml', 'YAML output')
    .parse(argv)

  const files = program.args.slice(0)
  const json = !!program.json
  const ndjson = !!program.ndjson
  const queryFile = program.queryFile
  const spread = !!program.spread
  const yamlOut = !!program.yaml
  const yamlIn = !!program.acceptYaml

  const query = await getQuery(queryFile, files)
  return {files, json, ndjson, query, spread, yamlOut, yamlIn}
}

const getQuery = async (queryFile, files) => {
  if (typeof queryFile === 'string' && queryFile.length) {
    return readFilePromise(queryFile, 'utf8')
  } else {
    // If the first argument is a file that exists, then it was not a query string
    // If the first argument is not defined, then it was not a query string
    const isNotQuery = files[0] ? await fileExists(files[0]) : true
    return (isNotQuery ? '$' : files.shift())
  }
}
