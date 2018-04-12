/* eslint-env jest */

import {run, runStdin, pkgjsonPath, fixturePath} from '../test-helper'

describe('inputs', () => {
  describe('methods of input', () => {
    it('takes input from a file', async () => {
      const res = await run('$', pkgjsonPath)
      expect(res.error).toBeNull()
      expect(res.stderr).toBe('')
      expect(JSON.parse(res.stdout).name).toEqual('jfq')
    })

    it('takes input from STDIN', async () => {
      const input = '{"fake":"data"}'
      const res = await runStdin(input, 'fake')
      expect(res.error).toBeNull()
      expect(res.stderr).toBe('')
      expect(res.stdout).toEqual('data')
    })

    describe('when there are multiple files', () => {
      it('takes input from multiple files', async () => {
        const res = await run('foo', fixturePath('a.json'), fixturePath('b.json'))
        expect(res.error).toBeNull()
        expect(res.stderr).toBe('')
        expect(res.stdout).toEqual('bar\nbaz')
      })

      it('joins the output of arrays nicely', async () => {
        const res = await run('listy', fixturePath('a.json'), fixturePath('b.json'))
        expect(res.error).toBeNull()
        expect(res.stderr).toBe('')
        expect(res.stdout).toEqual('alpha\nbeta\ngamma\ndelta')
      })
    })
  })

  describe('ommitting the expression', () => {
    it('treats the first argument as an input file', async () => {
      const res = await run(pkgjsonPath)
      expect(res.error).toBeNull()
      expect(res.stderr).toBe('')
      expect(JSON.parse(res.stdout).name).toEqual('jfq')
    })
  })

  describe('JSON parse errors', () => {
    it('reports the position in STDIN', async () => {
      const input = '{"invalid'
      const res = await runStdin(input)
      expect(res.stderr).toBeNull()
      expect(res.stdout).toBeNull()
      expect(res.error.message).toContain(`Unexpected token  in JSON at position 9 while parsing '{"invalid'`)
    })

    it('reports the position and file name for files', async () => {
      const path = fixturePath('bad.json')
      const res = await run('$', path)
      expect(res.stderr).toBeNull()
      expect(res.stdout).toBeNull()
      expect(res.error.message).toContain(`Unexpected token f in JSON at position 4 while parsing near '{  foo: 42}' in ${path}`)
    })
  })

  describe('YAML input', () => {
    it('accepts YAML input', async () => {
      const res = await run('-a', 'baz', fixturePath('c.yaml'))
      expect(res.error).toBeNull()
      expect(res.stderr).toBe('')
      expect(res.stdout).toBe('alpha\nbeta')
    })

    describe('parse errors', () => {
      it('reports the file name', async () => {
        const path = fixturePath('bad.yaml')
        const res = await run('-a', '$', path)
        expect(res.stderr).toBeNull()
        expect(res.stdout).toBeNull()
        expect(res.error.message).toContain(`in file ${path}`)
      })

      it('does not report file names with stdin', async () => {
        const res = await runStdin('{foo}}', '-a')
        expect(res.stderr).toBeNull()
        expect(res.stdout).toBeNull()
        expect(res.error.message).toContain(`end of the stream or a document separator is expected at line 1, column 6:\n    {foo}}\n         ^`)
      })
    })
  })

  describe('files not found', () => {
    it('reports the error', async () => {
      const res = await run('$', 'not_here_sucker.json')
      expect(res.stderr).toBeNull()
      expect(res.stdout).toBeNull()
      expect(res.error.message).toContain(`ENOENT: no such file or directory, open 'not_here_sucker.json'`)
    })
  })

  describe('query in a file', () => {
    it('reads the file', async () => {
      const res = await run('-q', fixturePath('query.jsonata'), pkgjsonPath)
      expect(res.error).toBeNull()
      expect(res.stderr).toBe('')
      expect(res.stdout).toContain('jfq')
    })
  })
})
