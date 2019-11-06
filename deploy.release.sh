#!/bin/sh
export GAS_DEBUG=0&&
./node_modules/.bin/webpack&&
cp src/appsscript.json dist/appsscript.json&&
cp .clasp.release.json .clasp.json&&
clasp push
cp .clasp.test.json .clasp.json