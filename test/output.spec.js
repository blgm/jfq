/* eslint-env jest */

import CliTest from 'command-line-test'

describe('output format', () => {
  it('outputs as formatted JSON', function * () {
    const data = {fake: [{json: 'data'}]}
    const input = JSON.stringify(data)
    const expected = JSON.stringify(data, null, 2)

    const cliTest = new CliTest()
    const res = yield cliTest.exec(`echo '${input}' | ./bin/jfq.js`)

    expect(res.error).toBeNull()
    expect(res.stderr).toBe('')
    expect(res.stdout).toEqual(expected)
  })
})
