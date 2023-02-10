/* eslint-env jest */

import { run } from '../test-helper'

describe('queries', () => {
  describe('valid', () => {
    describe('single property', () => {
      it('gets the corresponding value', async () => {
        const result = await run('name', 'package.json')
        expect(result.error).toBeNull()
        expect(result.stderr).toBe('')
        expect(result.stdout).toEqual('jfq')
      })
    })
  })

  describe('invalid', () => {
    it('returns the error from JSONata', async () => {
      const result = await run('na!me', 'package.json')
      expect(result.error.message).toContain('Failed to compile JSONata expression: Unknown operator: "!"')
    })
  })
})
