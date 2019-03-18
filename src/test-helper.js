import CliTest from 'command-line-test'

export const run = (...parms) => exec(command(parms))

export const runStdin = (stdin, ...parms) => exec(`echo '${stdin}' | ` + command(parms))

const command = parms => './bin/jfq.js -p ' + parms.join(' ')

const exec = command => {
  const cliTest = new CliTest()
  return cliTest.exec(command)
}
