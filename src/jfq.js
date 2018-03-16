import colorize from 'json-colorizer'
import jsonata from 'jsonata'
import parseJson from 'parse-json'
import readInput from 'read-input'
import getopts from './getopts'
import YAML from 'js-yaml'

const main = async () => {
  const {files, ndjson, json, yamlIn, yamlOut, query} = await getopts(process.argv)
  const evaluator = parseQuery(query)
  const data = await readInput(files)

  data.files.forEach(file => {
    if (file.error) {
      throw file.error
    } else {
      const input = yamlIn ? parseYaml(file.data, file.name) : parseJson(file.data, file.name)
      const result = evaluator.evaluate(input)
      const output = yamlOut ? formatYaml(result) : formatJson(result, ndjson, json)
      console.log(output)
    }
  })
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
