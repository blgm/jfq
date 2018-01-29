/* eslint-env jest */

import CliTest from 'command-line-test'

describe('test', () => {
  it('test', function * () {
    const cliTest = new CliTest()
    const res = yield cliTest.exec('babel-node ./jfq.js package.json')

    const _pkg = JSON.parse(res.stdout)
    expect(_pkg.name).toEqual('jfq')
  })
})
