/* eslint-env jest */

import {run} from '../test-helper'

describe('inputs', () => {
  it('takes input from a file', () => {
    return run('$', 'package.json')
      .then(res => {
        expect(res.error).toBeNull()
        expect(res.stderr).toBe('')
        expect(JSON.parse(res.stdout).name).toEqual('jfq')
      })
  })

  describe('when an expression is omitted and a file is specified', () => {
    it('treats it as in input file', () => {
      return run('package.json')
        .then(res => {
          expect(res.error).toBeNull()
          expect(res.stderr).toBe('')
          expect(JSON.parse(res.stdout).name).toEqual('jfq')
        })
    })
  })
})
