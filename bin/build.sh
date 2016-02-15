#! /bin/bash

set -e
mkdir -p dist
mkdir -p dist/node

babel src --out-dir dist/node --presets es2015
browserify ./src/index.js -t [ babelify --presets [ es2015 ] ] -o ./dist/event-node.js
