#!/bin/sh

DIR_JSONRPC2="`pwd`/submodules/jsonrpc2"
DIR_LANGSERVER="`pwd`/submodules/go-langserver/langserver/cmd/langserver-antha"

(\
	cd $DIR_JSONRPC2 && \
  `pwd` \
)

(\
	cd $DIR_LANGSERVER && \
  `pwd` \
)