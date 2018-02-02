/* eslint-env jest */

import {run} from '../test-helper'

describe('inputs', () => {
  it('takes input from a file', function () {
    return run('$', 'package.json')
      .then(res => {
        const _pkg = JSON.parse(res.stdout)
        expect(_pkg.name).toEqual('jfq')
      })
  })
})
