import childProcess from 'child_process'

export const run = (...parms) => exec(command(parms))

export const runStdin = (stdin, ...parms) => exec(`echo '${stdin}' | ` + command(parms))

const command = params => './bin/jfq.js -p ' + params.join(' ')

const exec = command => {
  return new Promise(resolve => {
    childProcess.exec(command, (error, stdout, stderr) => {
      resolve({
        error,
        stdout: stdout.trim(),
        stderr: stderr.trim()
      })
    })
  })
}
