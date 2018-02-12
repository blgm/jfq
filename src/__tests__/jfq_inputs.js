/* eslint-env jest */

import {run, runStdin} from '../test-helper'

describe('inputs', () => {
  describe('valid inputs', () => {
    it('takes input from a file', () => {
      return run('$', 'package.json')
        .then(res => {
          expect(res.error).toBeNull()
          expect(res.stderr).toBe('')
          expect(JSON.parse(res.stdout).name).toEqual('jfq')
        })
    })

    it('takes input from STDIN', () => {
      const input = '{"fake":"data"}'

      return runStdin(input, 'fake')
        .then(res => {
          expect(res.error).toBeNull()
          expect(res.stderr).toBe('')
          expect(res.stdout).toEqual('data')
        })
    })

    describe('when there are multiple files', () => {
      it('takes input from multiple files', () => {
        return run('foo', 'src/__tests__/fixtures/a.json', 'src/__tests__/fixtures/b.json')
          .then(res => {
            expect(res.error).toBeNull()
            expect(res.stderr).toBe('')
            expect(res.stdout).toEqual('bar\nbaz')
          })
      })

      it('joins the output of arrays nicely', () => {
        return run('listy', 'src/__tests__/fixtures/a.json', 'src/__tests__/fixtures/b.json')
          .then(res => {
            expect(res.error).toBeNull()
            expect(res.stderr).toBe('')
            expect(res.stdout).toEqual('alpha\nbeta\ngamma\ndelta')
          })
      })
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

  describe('JSON parse errors', () => {
    it('reports the position in STDIN', () => {
      const input = '{"invalid'

      return runStdin(input)
        .then(res => {
          expect(res.stderr).toBeNull()
          expect(res.stdout).toBeNull()
          expect(res.error.message).toContain(`Unexpected token  in JSON at position 9 while parsing '{"invalid'`)
        })
    })
  })

  describe('files not found', () => {
    it('reports the error', () => {
      return run('$', 'not_here_sucker.json')
        .then(res => {
          expect(res.stderr).toBeNull()
          expect(res.stdout).toBeNull()
          expect(res.error.message).toContain(`ENOENT: no such file or directory, open 'not_here_sucker.json'`)
        })
    })
  })
})
