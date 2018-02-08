/* eslint-env jest */

import {run} from '../test-helper'

describe('queries', () => {
  describe('valid', () => {
    describe('single property', () => {
      it('gets the corresponding value', () => {
        return run('name', 'package.json')
          .then(result => {
            expect(result.error).toBeNull()
            expect(result.stderr).toBe('')
            expect(result.stdout).toEqual('"jfq"')
          })
      })
    })
  })

  describe('invalid', () => {
    it('returns the error from JSONata', () => {
      return run('na!me', 'package.json')
        .then(result => {
          expect(result.error).toBeNull()
          expect(result.stderr).toBe('Failed to compile JSONata expression: Unknown operator: "!"')
          expect(result.stdout).toBe('')
        })
    })
  })
})
