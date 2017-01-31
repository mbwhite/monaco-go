#!/bin/bash -x

set -e

LANGSERVER_DOCKER_DEBUG="$2"
LANGSERVER_ADDR=":$LANGSERVER_PORT"
LANGSERVER_LOG_FILE="go-langserver.log"
LANGSERVER_PATH_PREFIX="/var/log/monaco-go"
LANGSERVER_LOG_PATH="$LANGSERVER_PATH_PREFIX/$LANGSERVER_LOG_FILE"

mkdir -p $LANGSERVER_PATH_PREFIX
touch $LANGSERVER_LOG_PATH

echo "pwd: $(pwd)";
echo " ls: $(ls -lah /webapp)"

langserver-go -mode ws -addr $LANGSERVER_ADDR -trace -logfile $LANGSERVER_LOG_PATH
