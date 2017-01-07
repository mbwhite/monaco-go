#!/bin/bash

echo "docker-entrypoint.sh: " $@

LANGSERVER_REPO="$2"
LANGSERVER_PORT="$4"
LANGSERVER_DOCKER_DEBUG="$5"

# LANGSERVER_ADDR=":$LANGSERVER_PORT"
echo "          repo: " $LANGSERVER_REPO
echo "          port: " $LANGSERVER_PORT
echo "          addr: " $LANGSERVER_ADDR
echo "  docker debug: " $LANGSERVER_DOCKER_DEBUG

source $NVM_DIR/nvm.sh

# fetch repo then start the langserver then the server
# hosting the monaco-go editor

# go get -x $1

echo "--------------"
echo "  docker debug: " $LANGSERVER_DOCKER_DEBUG
$LANGSERVER_DOCKER_DEBUG
ls -lah /Users/mbana/monaco-go/docs/
echo "--------------"

langserver-antha -mode ws -trace -addr $LANGSERVER_ADDR &
npm run serve