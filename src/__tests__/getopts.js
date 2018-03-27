/* eslint-env jest */
import getopts from '../getopts.js'

const fakeArgv = (...opts) => ([process.execPath, '/tmp/fakePath.js', ...opts])

describe('getting command line options', () => {
  describe('when there are no options', () => {
    it('returns default values', async () => {
      const res = await getopts(fakeArgv())
      expect(res.query).toBe('$')
      expect(res.files).toEqual([])
      expect(res.ndjson).toBe(false)
    })
  })

  describe('when there is a query and a file', () => {
    it('reads the query and the file', async () => {
      const res = await getopts(fakeArgv('fake.query', 'fake.file'))
      expect(res.query).toBe('fake.query')
      expect(res.files).toEqual(['fake.file'])
    })
  })

  describe('when the first argument is a file and not a query', () => {
    it('reads it as a file, using the default query', async () => {
      const res = await getopts(fakeArgv('package.json'))
      expect(res.query).toBe('$')
      expect(res.files).toEqual(['package.json'])
    })
  })

  describe('when a query file is specified', () => {
    it('reads the query from the file', async () => {
      const res = await getopts(fakeArgv('-q', './src/__tests__/fixtures/query.jsonata'))
      expect(res.query).toContain('name')
    })
  })
})
