#!/bin/sh

# build:
# vscode-languageserver-types
# vscode-jsonrpc
# vscode-languageclient

(\
  DIR_LANGUAGE_CLIENT="`pwd`/submodules/vscode-languageserver-node";
	cd $DIR_LANGUAGE_CLIENT && \
  ./build/all.sh \
)