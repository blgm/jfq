import CliTest from 'command-line-test'
import path from 'path'
import process from 'process'
import chdir from 'chdir-promise'

export const run = (...parms) => exec(command(parms))

export const runStdin = (stdin, ...parms) => exec(`echo '${stdin}' | ` + command(parms))

export const runIn = (dir, ...parms) => chdir
  .to(dir)
  .then(() => run(...parms))
  .tap(chdir.back)
  .finally(chdir.back)

export const fixturePath = fxt => path.normalize(path.join(process.cwd(), 'src/__tests__/fixtures', fxt))

export const pkgjsonPath = path.normalize(path.join(process.cwd(), 'package.json'))

const jfq = path.normalize(path.join(process.cwd(), './bin/jfq.js'))

const command = parms => jfq + ' ' + parms.join(' ')

const exec = command => {
  const cliTest = new CliTest()
  return cliTest.exec(command)
}
