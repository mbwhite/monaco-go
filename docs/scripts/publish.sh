#!/bin/sh -x

# copy bower_components and node_modules
( \
  mkdir deps && \
  cd deps && \
  cp -r ../../bower_components/ bower_components && \
  cp -r ../../node_modules/ node_modules && \
  ls -lhAGL \
)

# link to copies
( \
  ln -s deps/bower_components bower_components && \
  ln -s deps/node_modules node_modules && \
  ls -lhAGL \
)