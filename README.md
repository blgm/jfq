[![npm](https://img.shields.io/npm/v/jfq.svg)](https://www.npmjs.com/package/jfq)
[![Build Status](https://travis-ci.org/blgm/jfq.svg?branch=master)](https://travis-ci.org/blgm/jfq)

# jfq
[JSONata](http://jsonata.org/) on the command line.

This was inspired by the excellent [jq](https://stedolan.github.io/jq/) utility, and uses JSONata rather than the
`jq` language.

## Installation
```
npm install --global jfq
```

## Usage
```
jfq [options] [<JSONata query>] [<files>]
```

It is good practice to put the JSONata query in single quotes, so that the shell does
not attempt to interpret it.

The output will formatted as JSON, unless it's an array of simple objects (e.g. string, number)
when the output is flattened to a series of lines, so that it can be piped to another program such as `xargs`.

Options
- `-n, --ndjson` output as newline-delimited JSON (each object on a single line)
- `-j, --json` force output as JSON, when it would normally be flattened
- `-y, --yaml` output as YAML
- `-a, --accept-yaml` accept YAML input
- `-q, --query-file <path>` read JSONata query from a file

## Examples
- To read the version of JSONata from the file `package.json`:
```
jfq 'dependencies.jsonata' package.json

# ^1.5.0
```

- To find out how many downloads of JSONata there have been each month in the past year:
```
curl -s \
  https://api.npmjs.org/downloads/range/last-year/jsonata \
  | jfq 'downloads{$substring(day, 0, 7): $sum(downloads)}'

# {
#  "2017-02": 36216,
#  "2017-03": 46460,
#  "2017-04": 40336,
#  ...
# }
```
