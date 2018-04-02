import CliTest from 'command-line-test'
import path from 'path'
import process from 'process'

export const run = (...parms) => exec(command(parms))

export const runStdin = (stdin, ...parms) => exec(`echo '${stdin}' | ` + command(parms))

export const runIn = (dir, ...parms) => exec(`cd "${dir}" && ` + command(parms))

export const pkgjson = path.normalize(path.join(process.cwd(), 'package.json'))

const jfq = path.normalize(path.join(process.cwd(), './bin/jfq.js'))

const command = parms => jfq + ' ' + parms.join(' ')

const exec = command => {
  const cliTest = new CliTest()
  return cliTest.exec(command)
}
