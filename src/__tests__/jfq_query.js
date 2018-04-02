/* eslint-env jest */

import {run, pkgjson} from '../test-helper'

describe('queries', () => {
  describe('valid', () => {
    describe('single property', () => {
      it('gets the corresponding value', async () => {
        const result = await run('name', pkgjson)
        expect(result.error).toBeNull()
        expect(result.stderr).toBe('')
        expect(result.stdout).toEqual('jfq')
      })
    })
  })

  describe('invalid', () => {
    it('returns the error from JSONata', async () => {
      const result = await run('na!me', pkgjson)
      expect(result.stderr).toBeNull()
      expect(result.stdout).toBeNull()
      expect(result.error.message).toContain('Failed to compile JSONata expression: Unknown operator: "!"')
    })
  })
})
