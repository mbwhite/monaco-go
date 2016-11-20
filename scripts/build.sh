#!/bin/sh

echo "---"
echo "BUILDING `pwd`"

DEPS="vscode-jsonrpc vscode-languageserver-types vscode-go-languageservice vscode-languageclient"
# DEPS="vscode-jsonrpc vscode-languageserver-types vscode-languageclient"
echo "DEPS: $DEPS"

for DEP in ${DEPS}; do
    yarn link "${DEP}"
done

yarn install
yarn run compile

echo "---"