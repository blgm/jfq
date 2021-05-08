import fileExists from 'file-exists'
import program from 'commander'
import readFilePromise from 'fs-readfile-promise'

export default async argv => {
  const options = program
    .option('-n, --ndjson', 'Newline Delimited JSON')
    .option('-j, --json', 'Force JSON output')
    .option('-y, --yaml', 'YAML output')
    .option('-a, --accept-yaml', 'YAML input')
    .option('-p, --plain-text', 'Do not decorate output')
    .option('-q, --query-file <path>', 'JSONata query file')
    .option('-l, --jsonlines-input', 'JSON Lines Input')
    .option('-k, --jsonlines-output', 'JSON Lines Output')
    .parse(argv)
    .opts()

  const ndjsonOpt = !!options.ndjson
  const jsonlinesOutputOpt = !!options.jsonlinesOutput

  if (ndjsonOpt && jsonlinesOutputOpt) {
    throw new Error('can only set --ndjson or --jsonlines-output')
  }

  const json = !!options.json
  const yamlOut = !!options.yaml
  const yamlIn = !!options.acceptYaml
  const plainText = !!options.plainText
  const queryFile = options.queryFile
  // two aliases
  const jsonlinesInput = !!options.jsonlinesInput
  const jsonlinesOutput = ndjsonOpt || jsonlinesOutputOpt
  const ndjson = jsonlinesOutput
  const files = program.args.slice(0)

  if (yamlIn && jsonlinesInput) {
    throw new Error('--accept-yaml and --jsonlines can not be set together')
  }

  if (jsonlinesInput && !jsonlinesOutput) {
    throw new Error('--jsonlines-input requires --jsonlines-output/ndjson as output')
  }

  const query = await getQuery(queryFile, files)
  return {
    query,
    files,
    ndjson,
    json,
    yamlOut,
    yamlIn,
    plainText,
    jsonlinesInput,
    jsonlinesOutput
  }
}

const exists = async (path) => {
  try {
    return await fileExists(path)
  } catch (err) {
    return false
  }
}

const getQuery = async (queryFile, files) => {
  if (typeof queryFile === 'string' && queryFile.length) {
    return readFilePromise(queryFile, 'utf8')
  } else {
    // If the first argument is a file that exists, then it was not a query string
    // If the first argument is not defined, then it was not a query string
    const isNotQuery = files[0] ? await exists(files[0]) : true
    return (isNotQuery ? '$' : files.shift())
  }
}
