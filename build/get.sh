#!/bin/sh

( \
  REPOS_DIR="/tmp/repos/ghub" && \
  mkdir -p $REPOS_DIR && cd $REPOS_DIR && \
  git@github.com:mbana/monaco-go.git && \
  cd monaco-go && \
  ./build/all.sh \
)