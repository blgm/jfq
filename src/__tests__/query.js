/* eslint-env jest */

import {run} from '../test-helper'

describe('queries', () => {
  it('single property', function () {
    return run('name', 'package.json')
      .then(res => {
        const name = JSON.parse(res.stdout)
        expect(name).toEqual('jfq')
      })
  })
})
