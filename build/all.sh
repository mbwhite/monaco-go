#!/bin/sh -x

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
# monaco

# # run bower install for polymer
# ( \
#   echo `pwd` && \
#   bower install \
# )

# `npm run test` is a bad hack to get around commonjs module required
# for testing
( \
  echo `pwd` && \
  npm link "vscode-languageserver-types" && \
  npm link "vscode-languageclient" && \
  npm install --silent && \
  npm run compile && \
  # npm run test && \
  npm run compile \
)