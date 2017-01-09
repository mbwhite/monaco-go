#!/bin/sh -x

BASEDIR=$(dirname "$0")

echo "---------"
echo "start server:"
( \
  HTTP_SERVER_BIN=$(find `pwd` -name http-server -and -not -path "*_site*" | head -n1) ; \
  echo $HTTP_SERVER_BIN ; \
  cd .. ; \
  pwd ; \
  $HTTP_SERVER_BIN -p 4000 -c-1 --utc \
)
echo "---------"
