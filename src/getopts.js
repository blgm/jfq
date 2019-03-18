import fileExists from 'file-exists'
import program from 'commander'
import readFilePromise from 'fs-readfile-promise'

export default async argv => {
  program
    .option('-n, --ndjson', 'Newline Delimited JSON')
    .option('-j, --json', 'Force JSON output')
    .option('-y, --yaml', 'YAML output')
    .option('-a, --accept-yaml', 'YAML input')
    .option('-p, --plain-text', 'Do not decorate output')
    .option('-q, --query-file <path>', 'JSONata query file')
    .parse(argv)

  const ndjson = !!program.ndjson
  const json = !!program.json
  const yamlOut = !!program.yaml
  const yamlIn = !!program.acceptYaml
  const plainText = !!program.plainText
  const queryFile = program.queryFile
  const files = program.args.slice(0)

  const query = await getQuery(queryFile, files)
  return { query, files, ndjson, json, yamlOut, yamlIn, plainText }
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
