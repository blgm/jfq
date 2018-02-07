/* eslint-env jest */
import getopts from '../getopts.js'

const fakeArgv = (...opts) => ([process.execPath, '/tmp/fakePath.js', ...opts])

describe('getting command line options', () => {
  describe('when there are no options', () => {
    it('returns default values', () => {
      return getopts(fakeArgv())
        .then(res => {
          expect(res.query).toBe('$')
          expect(res.files).toEqual([])
          expect(res.ndjson).toBe(false)
        })
    })
  })

  describe('when there is a query and a file', () => {
    it('reads the query and the file', () => {
      return getopts(fakeArgv('fake.query', 'fake.file'))
        .then(res => {
          expect(res.query).toBe('fake.query')
          expect(res.files).toEqual(['fake.file'])
        })
    })
  })

  describe('when the first argument is a file and not a query', () => {
    it('reads it as a file, using the default query', () => {
      return getopts(fakeArgv('package.json'))
        .then(res => {
          expect(res.query).toBe('$')
          expect(res.files).toEqual(['package.json'])
        })
    })
  })
})
