#!/bin/sh

BASEDIR=$(dirname "$0")

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