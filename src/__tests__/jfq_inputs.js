/* eslint-env jest */

import { run, runStdin } from '../test-helper'

describe('inputs', () => {
  describe('methods of input', () => {
    it('takes input from a file', async () => {
      const res = await run('$', 'package.json')
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
        const res = await run('foo', 'src/__tests__/fixtures/a.json', 'src/__tests__/fixtures/b.json')
        expect(res.error).toBeNull()
        expect(res.stderr).toBe('')
        expect(res.stdout).toEqual('bar\nbaz')
      })

      it('joins the output of arrays nicely', async () => {
        const res = await run('listy', 'src/__tests__/fixtures/a.json', 'src/__tests__/fixtures/b.json')
        expect(res.error).toBeNull()
        expect(res.stderr).toBe('')
        expect(res.stdout).toEqual('alpha\nbeta\ngamma\ndelta')
      })
    })
  })

  describe('ommitting the expression', () => {
    it('treats the first argument as an input file', async () => {
      const res = await run('package.json')
      expect(res.error).toBeNull()
      expect(res.stderr).toBe('')
      expect(JSON.parse(res.stdout).name).toEqual('jfq')
    })
  })

  describe('JSON parse errors', () => {
    it('reports the position in STDIN', async () => {
      const input = '{"foo": bar'
      const res = await runStdin(input)
      expect(res.error.message).toContain('Unexpected token b in JSON at position 8')
    })

    it('reports the position and file name for files', async () => {
      const res = await run('$', 'src/__tests__/fixtures/bad.json')
      expect(res.error.message).toContain('Unexpected token f in JSON at position 4 in file src/__tests__/fixtures/bad.json')
    })
  })

  describe('YAML input', () => {
    it('accepts YAML input', async () => {
      const res = await run('-a', 'baz', 'src/__tests__/fixtures/c.yaml')
      expect(res.error).toBeNull()
      expect(res.stderr).toBe('')
      expect(res.stdout).toBe('alpha\nbeta')
    })

    describe('parse errors', () => {
      it('reports the file name', async () => {
        const res = await run('-a', '$', 'src/__tests__/fixtures/bad.yaml')
        expect(res.error.message).toContain('in file src/__tests__/fixtures/bad.yaml')
      })

      it('does not report file names with stdin', async () => {
        const res = await runStdin('{foo}}', '-a')
        expect(res.error.message).toContain('end of the stream or a document separator is expected (1:6)')
      })
    })
  })

  describe('files not found', () => {
    it('reports the error', async () => {
      const res = await run('$', 'not_here_sucker.json')
      expect(res.error.message).toContain("ENOENT: no such file or directory, open 'not_here_sucker.json'")
    })
  })

  describe('query in a file', () => {
    it('reads the file', async () => {
      const res = await run('-q', './src/__tests__/fixtures/query.jsonata', 'package.json')
      expect(res.error).toBeNull()
      expect(res.stderr).toBe('')
      expect(res.stdout).toContain('jfq')
    })
  })
})
