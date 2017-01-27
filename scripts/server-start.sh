#!/bin/sh

BASEDIR=$(dirname "$0")

echo "---------------"
HTTP_SERVER_PORT="8080"
HTTP_SERVER_BIN="`pwd`/node_modules/.bin/http-server"
echo "start http server:"
echo "HTTP_SERVER_BIN: " $HTTP_SERVER_BIN
echo "           port: " $HTTP_SERVER_PORT

cd ..
pwd


FILE_PREFIX=$1
echo "FILE_PREFIX: ${FILE_PREFIX}"
FILE_CERT=$(realpath --relative-to=`pwd` ${FILE_PREFIX}/certificate-401235.crt)
FILE_KEY=$(realpath --relative-to=`pwd` ${FILE_PREFIX}/myserver.key)

$HTTP_SERVER_BIN \
	-p $HTTP_SERVER_PORT \
	-c 3600 \
	--ssl \
	--cert $FILE_CERT \
	--key $FILE_KEY \
	--utc; \

echo "---------------"