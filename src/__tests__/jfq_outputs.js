/* eslint-env jest */

import { run, runStdin } from '../test-helper'
import YAML from 'js-yaml'

describe('output format', () => {
  describe('when there is no output', () => {
    it('outputs nothing', async () => {
      const res = await run('notexists', 'package.json')
      expect(res.error).toBeNull()
      expect(res.stderr).toBe('')
      expect(res.stdout).toBe('')
    })
  })

  describe('when the output is a single string', () => {
    it('prints it as an undecorated string', async () => {
      const res = await run('name', 'package.json')
      expect(res.error).toBeNull()
      expect(res.stderr).toBe('')
      expect(res.stdout).toBe('jfq')
    })

    it('prints a decorated string when the -j flag is specified', async () => {
      const res = await run('-j', 'name', 'package.json')
      expect(res.error).toBeNull()
      expect(res.stderr).toBe('')
      expect(res.stdout).toBe('"jfq"')
    })
  })

  describe('when the output is a single number', () => {
    it('prints it as an undecorated number', async () => {
      const input = '{"num":42}'
      const res = await runStdin(input, 'num')
      expect(res.error).toBeNull()
      expect(res.stderr).toBe('')
      expect(res.stdout).toBe('42')
    })
  })

  describe('when the output is an array of string/number types', () => {
    it('prints each entry on a new line', async () => {
      const input = '{"arr":[1,"foo"]}'
      const res = await runStdin(input, 'arr')
      expect(res.error).toBeNull()
      expect(res.stderr).toBe('')
      expect(res.stdout).toBe('1\nfoo')
    })

    it('prints as JSON when the -j flag is specified', async () => {
      const data = { arr: [1, 'foo'] }
      const input = JSON.stringify(data)
      const expected = JSON.stringify(data.arr, null, 2)
      const res = await runStdin(input, '-j', 'arr')
      expect(res.error).toBeNull()
      expect(res.stderr).toBe('')
      expect(res.stdout).toBe(expected)
    })
  })

  describe('when the output is an array with complex types', () => {
    it('prints JSON', async () => {
      const data = { arr: [1, 'foo', [6]] }
      const input = JSON.stringify(data)
      const expected = JSON.stringify(data.arr, null, 2)
      const res = await runStdin(input, 'arr')
      expect(res.error).toBeNull()
      expect(res.stderr).toBe('')
      expect(res.stdout).toBe(expected)
    })
  })

  describe('default', () => {
    it('outputs as formatted JSON over multiple lines', async () => {
      const data = { fake: [{ json: 'data' }] }
      const input = JSON.stringify(data)
      const expected = JSON.stringify(data, null, 2)
      const res = await runStdin(input)
      expect(res.error).toBeNull()
      expect(res.stderr).toBe('')
      expect(res.stdout).toEqual(expected)
    })
  })

  describe('when the `-n` flag is specified', () => {
    it('outputs as formatted JSON', async () => {
      const data = { fake: [{ json: 'data' }] }
      const input = JSON.stringify(data)
      const expected = JSON.stringify(data)
      const res = await runStdin(input, '-n')
      expect(res.error).toBeNull()
      expect(res.stderr).toBe('')
      expect(res.stdout).toEqual(expected)
    })

    describe('when the `-n` flag is specified with other options', () => {
      it('outputs as formatted JSON', async () => {
        const res = await run('-n', 'bugs', 'package.json')
        expect(res.error).toBeNull()
        expect(res.stderr).toBe('')
        expect(res.stdout).toEqual('{"url":"https://github.com/blgm/jfq/issues"}')
      })
    })
  })

  describe('when the `-y` flag is specified', () => {
    it('prints output in YAML', async () => {
      const data = { fake: [{ json: 'data' }] }
      const input = JSON.stringify(data)
      const expected = YAML.dump(data).trim()
      const res = await runStdin(input, '-y')
      expect(res.error).toBeNull()
      expect(res.stderr).toBe('')
      expect(res.stdout).toEqual(expected)
    })

    describe('when there is no output', () => {
      it('outputs nothing', async () => {
        const res = await run('-y', 'notexists', 'package.json')
        expect(res.error).toBeNull()
        expect(res.stderr).toBe('')
        expect(res.stdout).toBe('')
      })
    })
  })
})
