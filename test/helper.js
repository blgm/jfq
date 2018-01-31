import CliTest from 'command-line-test'

export function run (...parms) {
  const cliTest = new CliTest()
  return cliTest.exec(command(parms))
}

export function runStdin (stdin, ...parms) {
  const cliTest = new CliTest()
  return cliTest.exec(`echo '${stdin}' | ` + command(parms))
}

const command = parms => './bin/jfq.js ' + parms.join(' ')
