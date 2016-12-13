#!/bin/sh

# remove previous build
( \
  FILES_BUILD="find . -maxdepth 2 -type d -name node_modules -o -name out -o -name release";
  echo "########" && \
  echo "rm: node_modules/, out/, release/:" && \
  ($FILES_BUILD | wc -l) && \
  ($FILES_BUILD | xargs rm -fr) && \
  echo "########" \
)

./build/build-libs.sh
./build/build-server.sh

( \
  echo "########" && \
  npm link "vscode-languageserver-types" && \
  npm link "vscode-languageclient" && \
  npm install && \
  npm run compile && \
  echo "########" \
)

( \
 echo "########" && \
 npm run serve && \
 echo "########" \
)