#!/bin/bash

function main {
  # we need the typescript compiler installed 
  command -v tsc >/dev/null 2>&1 || { echo "I require 'tsc' but it's not installed. Please run \`npm install -g typescript\`" >&2; exit 1; }
  # grab this directory so the script can be run relatively
  DIR=$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)
  # hop into the source directory, compile the javascript and run the tests
  cd $DIR/../run-suite-task && tsc && npm test
  # exit with our test status
  exit $?
}

main
