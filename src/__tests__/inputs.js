/* eslint-env jest */

import {run} from '../test-helper'

describe('inputs', () => {
  it('takes input from a file', function () {
    return run('$', 'package.json')
      .then(res => {
        expect(res.error).toBeNull()
        expect(res.stderr).toBe('')
        expect(JSON.parse(res.stdout).name).toEqual('jfq')
      })
  })
})
