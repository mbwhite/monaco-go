#!/bin/sh

BUILD_FILES="find . -maxdepth 2 -mindepth 2 -type d -name node_modules -o -name out -o -name release"

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
  npm unlink  && \
  npm link "vscode-languageserver-types" && \
  npm link "vscode-languageclient" && \
  npm install && \
  npm run compile && \
  npm link && \
  echo "########" \
)

( \
  echo "########" && \
  echo "find: node_modules/, out/, release/:" && \
  ($BUILD_FILES) && \
  echo "########" \
)