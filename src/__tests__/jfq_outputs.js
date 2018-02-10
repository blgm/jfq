/* eslint-env jest */

import {run, runStdin} from '../test-helper'
import YAML from 'js-yaml'

describe('output format', () => {
  describe('when there is no output', () => {
    it('outputs nothing', () => {
      return run('notexists', 'package.json')
        .then(res => {
          expect(res.error).toBeNull()
          expect(res.stderr).toBe('')
          expect(res.stdout).toBe('')
        })
    })
  })

  describe('when the output is a single string', () => {
    it('prints it as an undecorated string', () => {
      return run('name', 'package.json')
        .then(res => {
          expect(res.error).toBeNull()
          expect(res.stderr).toBe('')
          expect(res.stdout).toBe('jfq')
        })
    })

    it('prints a decorated string when the -j flag is specified', () => {
      return run('-j', 'name', 'package.json')
        .then(res => {
          expect(res.error).toBeNull()
          expect(res.stderr).toBe('')
          expect(res.stdout).toBe('"jfq"')
        })
    })
  })

  describe('when the output is a single number', () => {
    it('prints it as an undecorated number', () => {
      const input = '{"num":42}'
      return runStdin(input, 'num')
        .then(res => {
          expect(res.error).toBeNull()
          expect(res.stderr).toBe('')
          expect(res.stdout).toBe('42')
        })
    })
  })

  describe('when the output is an array of string/number types', () => {
    it('prints each entry on a new line', () => {
      const input = '{"arr":[1,"foo"]}'
      return runStdin(input, 'arr')
        .then(res => {
          expect(res.error).toBeNull()
          expect(res.stderr).toBe('')
          expect(res.stdout).toBe('1\nfoo')
        })
    })

    it('prints as JSON when the -j flag is specified', () => {
      const data = {arr: [1, 'foo']}
      const input = JSON.stringify(data)
      const expected = JSON.stringify(data.arr, null, 2)
      return runStdin(input, '-j', 'arr')
        .then(res => {
          expect(res.error).toBeNull()
          expect(res.stderr).toBe('')
          expect(res.stdout).toBe(expected)
        })
    })
  })

  describe('when the output is an array with complex types', () => {
    it('prints JSON', () => {
      const data = {arr: [1, 'foo', [6]]}
      const input = JSON.stringify(data)
      const expected = JSON.stringify(data.arr, null, 2)
      return runStdin(input, 'arr')
        .then(res => {
          expect(res.error).toBeNull()
          expect(res.stderr).toBe('')
          expect(res.stdout).toBe(expected)
        })
    })
  })

  describe('default', () => {
    it('outputs as formatted JSON over multiple lines', () => {
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
    it('outputs as formatted JSON', () => {
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

    describe('when the `-n` flag is specified with other options', () => {
      it('outputs as formatted JSON', () => {
        return run('-n', 'bugs', 'package.json')
          .then(res => {
            expect(res.error).toBeNull()
            expect(res.stderr).toBe('')
            expect(res.stdout).toEqual('{"url":"https://github.com/blgm/jfq/issues"}')
          })
      })
    })
  })

  describe('when the `-y` flag is specified', () => {
    it('prints output in YAML', () => {
      const data = {fake: [{json: 'data'}]}
      const input = JSON.stringify(data)
      const expected = YAML.safeDump(data).trim()

      return runStdin(input, '-y')
        .then(res => {
          expect(res.error).toBeNull()
          expect(res.stderr).toBe('')
          expect(res.stdout).toEqual(expected)
        })
    })
  })
})
