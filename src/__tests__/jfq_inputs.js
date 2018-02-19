/* eslint-env jest */

import {run, runStdin} from '../test-helper'

describe('inputs', () => {
  describe('methods of input', () => {
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

  describe('ommitting the expression', () => {
    it('treats the first argument as an input file', () => {
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

    it('reports the position and file name for files', () => {
      return run('$', 'src/__tests__/fixtures/bad.json')
        .then(res => {
          expect(res.stderr).toBeNull()
          expect(res.stdout).toBeNull()
          expect(res.error.message).toContain(`Unexpected token f in JSON at position 4 while parsing near '{  foo: 42}' in src/__tests__/fixtures/bad.json`)
        })
    })
  })

  describe('YAML input', () => {
    it('accepts YAML input', () => {
      return run('-a', 'baz', 'src/__tests__/fixtures/c.yaml')
        .then(res => {
          expect(res.error).toBeNull()
          expect(res.stderr).toBe('')
          expect(res.stdout).toBe('alpha\nbeta')
        })
    })

    describe('parse errors', () => {
      it('reports the file name', () => {
        return run('-a', '$', 'src/__tests__/fixtures/bad.yaml')
          .then(res => {
            expect(res.stderr).toBeNull()
            expect(res.stdout).toBeNull()
            expect(res.error.message).toContain(`in file src/__tests__/fixtures/bad.yaml`)
          })
      })

      it('does not report file names with stdin', () => {
        return runStdin('{foo}}', '-a')
          .then(res => {
            expect(res.stderr).toBeNull()
            expect(res.stdout).toBeNull()
            expect(res.error.message).toContain(`end of the stream or a document separator is expected at line 1, column 6:\n    {foo}}\n         ^`)
          })
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
