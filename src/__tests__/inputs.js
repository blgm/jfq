/* eslint-env jest */

import {run} from '../test-helper'

describe('test', () => {
  it('test', function () {
    return run('package.json')
      .then(res => {
        const _pkg = JSON.parse(res.stdout)
        expect(_pkg.name).toEqual('jfq')
      })
  })
})
