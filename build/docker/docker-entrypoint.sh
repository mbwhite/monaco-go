#!/bin/bash

echo "docker-entrypoint.sh: " $@

LANGSERVER_DOCKER_DEBUG="$2"

echo "---------------"
echo "   docker debug: " "$LANGSERVER_DOCKER_DEBUG"
echo "---------------"

source $NVM_DIR/nvm.sh

echo "---------------"
echo "            pwd: " `pwd`
echo "   docker debug: " "$LANGSERVER_DOCKER_DEBUG"
$LANGSERVER_DOCKER_DEBUG
echo "---------------"

echo "---------------"
echo '    langserver-go -mode ws -trace -addr $LANGSERVER_ADDR &'
langserver-go -mode ws -trace -addr $LANGSERVER_ADDR &
echo "---------------"

echo "---------------"
echo '    nginx &'
nginx &
echo "---------------"

/bin/bash