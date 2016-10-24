#!/bin/bash -x

TEST_FILE=$([[ -e "./test/index.html" ]] && echo "./test/index.html" || echo "monaco-go/test/index.html")

OS_TYPE=$(echo $OSTYPE)
case $OS_TYPE in
  darwin*)  open $TEST_FILE ;;
  linux*)   xdg-open $TEST_FILE ;;
  *)        echo "unknown: ${OS_TYPE}" ;;
esac
