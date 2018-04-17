import colorize from 'json-colorizer'
import jsonata from 'jsonata'
import parseJson from 'parse-json'
import readInput from 'read-input'
import YAML from 'js-yaml'
import pify from 'pify'
import fs from 'fs'
import getopts from './getopts'

const pfs = pify(fs)

const main = async () => {
  const {files, json, ndjson, query, spread, yamlIn, yamlOut} = await getopts(process.argv)
  const evaluator = parseQuery(query)
  const data = await readInput(files)

  data.files.forEach(file => {
    if (file.error) {
      throw file.error
    } else {
      const input = yamlIn ? parseYaml(file.data, file.name) : parseJson(file.data, file.name)
      const result = evaluator.evaluate(input)
      const opts = {result, yamlOut, json, ndjson}
      return spread ? spreadOutput(opts) : printOutput(opts)
    }
  })
}

const spreadOutput = async ({result, ...opts}) => {
  if (typeof result === 'object' && !Array.isArray(result)) {
    const promises = Object.keys(result).map(key => {
      const formatted = formatOutput({result: result[key], ...opts})
      return pfs.writeFile(key, formatted)
    })
    await Promise.all(promises)
  } else {
    throw new Error('Result must be an object when using the -s flag')
  }
}

const formatOutput = ({result, json, ndjson, yamlOut}) => yamlOut ? formatYaml(result) : formatJson(result, ndjson, json)

const printOutput = (opts) => {
  console.log(formatOutput(opts))
}

const parseQuery = query => {
  try {
    return jsonata(query)
  } catch (err) {
    throw new Error('Failed to compile JSONata expression: ' + err.message)
  }
}

const formatJson = (data, ndjson, json) => {
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
  return colorize(formatted)
}

// Is it an array containing only simple types
const isSimpleArray = arr => Array.isArray(arr) && !arr.some(i => typeof i !== 'string' && typeof i !== 'number')

const parseYaml = (string, fileName) => {
  try {
    return YAML.safeLoad(string, {json: true})
  } catch (err) {
    if (fileName) {
      throw new Error(err.message + ' in file ' + fileName)
    } else {
      throw err
    }
  }
}

const formatYaml = yaml => typeof yaml === 'undefined' ? '' : YAML.safeDump(yaml)

main()
  .catch(err => {
    console.error(err.message)
    process.exit(1)
  })
