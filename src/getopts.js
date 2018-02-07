import program from 'commander'

export default argv => {
  program
    .option('-n, --ndjson', 'Newline Delimited JSON')
    .parse(argv)
  const ndjson = !!program.ndjson

  const files = program.args.slice(0)
  var query = files.shift()

  if (typeof query !== 'string' || !query.length) {
    query = '$'
  }

  return {query, files, ndjson}
}
