/* eslint-env jest */

import YAML from 'js-yaml'
import tmp from 'tmp'
import fs from 'fs'
import path from 'path'
import {run, runStdin, runIn, pkgjsonPath, fixturePath} from '../test-helper'

describe('output format', () => {
  describe('when there is no output', () => {
    it('outputs nothing', async () => {
      const res = await run('notexists', pkgjsonPath)
      expect(res.error).toBeNull()
      expect(res.stderr).toBe('')
      expect(res.stdout).toBe('')
    })
  })

  describe('when the output is a single string', () => {
    it('prints it as an undecorated string', async () => {
      const res = await run('name', pkgjsonPath)
      expect(res.error).toBeNull()
      expect(res.stderr).toBe('')
      expect(res.stdout).toBe('jfq')
    })

    it('prints a decorated string when the -j flag is specified', async () => {
      const res = await run('-j', 'name', pkgjsonPath)
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
      const data = {arr: [1, 'foo']}
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
      const data = {arr: [1, 'foo', [6]]}
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
      const data = {fake: [{json: 'data'}]}
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
      const data = {fake: [{json: 'data'}]}
      const input = JSON.stringify(data)
      const expected = JSON.stringify(data)
      const res = await runStdin(input, '-n')
      expect(res.error).toBeNull()
      expect(res.stderr).toBe('')
      expect(res.stdout).toEqual(expected)
    })

    describe('when the `-n` flag is specified with other options', () => {
      it('outputs as formatted JSON', async () => {
        const res = await run('-n', 'bugs', pkgjsonPath)
        expect(res.error).toBeNull()
        expect(res.stderr).toBe('')
        expect(res.stdout).toEqual('{"url":"https://github.com/blgm/jfq/issues"}')
      })
    })
  })

  describe('when the `-y` flag is specified', () => {
    it('prints output in YAML', async () => {
      const data = {fake: [{json: 'data'}]}
      const input = JSON.stringify(data)
      const expected = YAML.safeDump(data).trim()
      const res = await runStdin(input, '-y')
      expect(res.error).toBeNull()
      expect(res.stderr).toBe('')
      expect(res.stdout).toEqual(expected)
    })

    describe('when there is no output', () => {
      it('outputs nothing', async () => {
        const res = await run('-y', 'notexists', pkgjsonPath)
        expect(res.error).toBeNull()
        expect(res.stderr).toBe('')
        expect(res.stdout).toBe('')
      })
    })
  })

  describe('when the `-s` flag is specified', () => {
    let tmpObj

    beforeEach(() => (tmpObj = tmp.dirSync()))

    afterEach(() => tmpObj.removeCallback())

    describe('and the value is not an object', () => {
      it('prints an error', async () => {
        const res = await runIn(tmpObj.name, '-s', 'name', pkgjsonPath)
        expect(res.stderr).toBeNull()
        expect(res.stdout).toBeNull()
        expect(res.error.message).toContain(`Result must be an object when using the -s flag`)
      })
    })

    const readTmpFile = basename => fs.readFileSync(path.join(tmpObj.name, basename), 'utf8')

    describe('and the value is an object', () => {
      it('creates a file for each key containing each value', async () => {
        const path = fixturePath('a.json')
        const res = await runIn(tmpObj.name, '-s', path)
        expect(res.error).toBeNull()
        expect(res.stderr).toBe('')
        expect(res.stdout).toBe('')
        expect(readTmpFile('foo')).toBe('"bar"')
        expect(readTmpFile('listy')).toBe('[\n  "alpha"\n  "beta"\n]')
      })
    })
  })
})
