/* eslint-env jest */

import {runStdin} from '../test-helper'

describe('output format', () => {
  describe('default', () => {
    it('outputs as formatted JSON over multiple lines', function () {
      const data = {fake: [{json: 'data'}]}
      const input = JSON.stringify(data)
      const expected = JSON.stringify(data, null, 2)

      return runStdin(input)
        .then(res => {
          expect(res.error).toBeNull()
          expect(res.stderr).toBe('')
          expect(res.stdout).toEqual(expected)
        })
    })
  })

  describe('when the `-n` flag is specified', () => {
    it('outputs as formatted JSON', function () {
      const data = {fake: [{json: 'data'}]}
      const input = JSON.stringify(data)
      const expected = JSON.stringify(data)

      return runStdin(input, '-n')
        .then(res => {
          expect(res.error).toBeNull()
          expect(res.stderr).toBe('')
          expect(res.stdout).toEqual(expected)
        })
    })
  })
})
