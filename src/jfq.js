import colorize from 'json-colorizer'
import jsonata from 'jsonata'
import parseJson from 'parse-json'
import readInput from 'read-input'
import * as lineReader from 'line-reader'
import getopts from './getopts'
import YAML from 'js-yaml'

const fullFileMode = async (opts, evaluator) => {
  const { files, ndjson, json, yamlIn, yamlOut, plainText } = opts

  const data = await readInput(files)

  data.files.forEach(file => {
    if (file.error) {
      throw file.error
    } else {
      const input = yamlIn ? parseYaml(file.data, file.name) : parseJson(file.data, file.name)
      const result = evaluator.evaluate(input)
      const output = yamlOut ? formatYaml(result) : formatJson(result, ndjson, json, plainText)
      console.log(output)
    }
  })
}

const streamingMode = async (opts, evaluator) => {
  const { files, ndjson, json, plainText } = opts
  if (files && files.length > 1) {
    console.error('streamingMode / jsonlines only works with one file/stream')
    process.exit(1)
  }
  const input = (files && files[0]) || process.stdin
  lineReader.eachLine(input, (line, last, continueCb) => {
    const lineInput = parseJson(line)
    const result = evaluator.evaluate(lineInput)
    const output = formatJson(result, ndjson, json, plainText)
    console.log(output)
    continueCb()
  })
}

const main = async () => {
  const opts = await getopts(process.argv)
  const evaluator = parseQuery(opts.query)
  if (!opts.jsonlinesInput) {
    await fullFileMode(opts, evaluator)
  } else {
    await streamingMode(opts, evaluator)
  }
}

const parseQuery = query => {
  try {
    return jsonata(query)
  } catch (err) {
    throw new Error('Failed to compile JSONata expression: ' + err.message)
  }
}

const formatJson = (data, ndjson, json, plainText) => {
  if (typeof data === 'undefined') {
    return ''
  }

  if (!json) {
    if (typeof data === 'string') {
      return data
    }

    if (isSimpleArray(data)) {
      return data.join('\n')
    }
  }

  const formatted = ndjson ? JSON.stringify(data) : JSON.stringify(data, null, 2)
  return plainText ? formatted : colorize(formatted)
}

// Is it an array containing only simple types
const isSimpleArray = arr => Array.isArray(arr) && !arr.some(i => typeof i !== 'string' && typeof i !== 'number')

const parseYaml = (string, fileName) => {
  try {
    return YAML.load(string, { json: true })
  } catch (err) {
    if (fileName) {
      throw new Error(err.message + ' in file ' + fileName)
    } else {
      throw err
    }
  }
}

const formatYaml = yaml => typeof yaml === 'undefined' ? '' : YAML.dump(yaml)

main()
  .catch(err => {
    console.error(err.message)
    process.exit(1)
  })
