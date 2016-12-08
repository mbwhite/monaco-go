#!/bin/sh

BUILD_FILES="find . -maxdepth 2 -type d -name node_modules -o -name out -o -name release"
# BUILD_FILES="find . -maxdepth 2 -type d -name out -o -name release"
($BUILD_FILES)

( \
  echo "########" && \
  echo "rm: node_modules/, out/, release/:" && \
  ($BUILD_FILES) && \
  echo "find: node_modules/, out/, release/:" && \
  ($BUILD_FILES | wc -l) && \
  ($BUILD_FILES | xargs rm -fr) && \
  echo "########" \
)

( \
  echo "########" && \
  echo "`pwd`" && \
  npm link "vscode-languageserver-types" && \
  npm link "vscode-languageclient" && \
  npm install && \
  npm run compile && \
  echo "########" \
)

( \
  echo "########" && \
  echo "find: node_modules/, out/, release/:" && \
  ($BUILD_FILES) && \
  echo "########" \
)

( \
 echo "########" && \
 echo "serving" && \
 npm run serve && \
 echo "########" \
)
