#!/bin/bash

echo "docker-entrypoint.sh: " $@

LANGSERVER_REPO="$2"
LANGSERVER_PORT="$4"
LANGSERVER_DOCKER_DEBUG="$5"

echo "---------------"
echo "           repo: " $LANGSERVER_REPO
echo "           port: " $LANGSERVER_PORT
echo "           addr: " $LANGSERVER_ADDR
echo "   docker debug: " $LANGSERVER_DOCKER_DEBUG
echo "---------------"

source $NVM_DIR/nvm.sh

# need to fetch the repo now
# go get -x $1

echo "---------------"
echo "            pwd: " `pwd`
echo "   docker debug: " $LANGSERVER_DOCKER_DEBUG
$LANGSERVER_DOCKER_DEBUG
echo "---------------"

langserver-antha -mode ws -trace -addr $LANGSERVER_ADDR &

echo "---------------"
HTTP_SERVER_PORT="8080"
HTTP_SERVER_BIN="`pwd`/node_modules/.bin/http-server"
echo "start http server:"
echo "HTTP_SERVER_BIN: " $HTTP_SERVER_BIN
echo "           port: " $HTTP_SERVER_PORT

( \
	cd .. ; \
	pwd ; \
	$HTTP_SERVER_BIN -p $HTTP_SERVER_PORT -c-1 --utc; \
)
echo "---------------"

