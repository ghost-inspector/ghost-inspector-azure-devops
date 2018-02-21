#!/bin/bash

function main {
  # we need team foundation tools installed https://www.npmjs.com/package/tfx-cli
  command -v tfx >/dev/null 2>&1 || { echo "I require 'tfx-cli' but it's not installed. Please run \`npm install -g tfx-cli\`" >&2; exit 1; }
  # grab this directory so the script can be run relatively
  DIR=$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)
  # run tests 
  $DIR/test.sh
  # if the tests fail, abort
  if [ $? -gt 0 ]; then
    echo 'Tests failed, aborting build...'
    exit 1
  fi
  # compile the vsix file
  cd $DIR/.. && tfx extension create
}

main
