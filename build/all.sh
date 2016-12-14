#!/bin/sh

# remove previous build
( \
  FILES_BUILD="find . -maxdepth 2 -type d -name node_modules -o -name out -o -name release";
  echo "rm: node_modules/, out/, release/:" `$FILES_BUILD | wc -l` && \
  ($FILES_BUILD | xargs rm -fr) \
)

# build:
# vscode-languageserver-types
# vscode-jsonrpc
# vscode-languageclient
(\
  DIR_LANGUAGE_CLIENT="`pwd`/submodules/vscode-languageserver-node";
	cd $DIR_LANGUAGE_CLIENT && \
  ./build/all.sh \
)

# build:
# jsonrpc2
# go-langserver
DIR_JSONRPC2="`pwd`/submodules/jsonrpc2"
DIR_LANGSERVER="`pwd`/submodules/go-langserver/langserver/cmd/langserver-antha"
(\
	cd $DIR_JSONRPC2 && \
  echo `pwd` \
)
(\
	cd $DIR_LANGSERVER && \
  echo `pwd` \
)

# build:
# monaco
( \
  echo `pwd` && \
  npm link "vscode-languageserver-types" && \
  npm link "vscode-languageclient" && \
  npm install --silent && \
  npm run compile \
)