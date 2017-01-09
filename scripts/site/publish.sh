#!/bin/sh -x

# copy bower_components and node_modules
( \
  mkdir deps && \
  cd deps && \
  cp -r ../../bower_components/ bower_components && \
  cp -r ../../node_modules/ node_modules && \
  ls -lhAGL && \
  mv bower_components ../ && \
  mv node_modules ../ && \
  cd .. && \
  rm -fr deps && \
  ls -lhAGL \
)