#! /bin/bash

set -e
mkdir -p dist
browserify ./index.js -t [ babelify --presets [ es2015 ] ] -o ./dist/event-node.js
