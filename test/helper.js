import CliTest from 'command-line-test'

export function run (...parms) {
  const cliTest = new CliTest()
  return cliTest.exec('./bin/jfq.js ' + parms.join(' '))
}

export function runStdin (stdin, ...parms) {
  const cliTest = new CliTest()
  return cliTest.exec(`echo '${stdin}' | ./bin/jfq.js ` + parms.join(' '))
}
