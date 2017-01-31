#!/bin/sh


DOMAIN_NAME_TOP="bana.io"
DOMAIN_NAME_SUB="cloud"
DOMAIN_FULL="$DOMAIN_NAME_SUB.$DOMAIN_NAME_TOP"
DOMAIN_SUB_FOLDER="$DOMAIN_NAME_TOP/$DOMAIN_NAME_SUB"
LANGSERVER_PATH_PREFIX="/var/log/nginx/$DOMAIN_SUB_FOLDER"

LANGSERVER_DOCKER_DEBUG="$2"
LANGSERVER_LOG_FILE="go-langserver.log"
LANGSERVER_LOG_PATH="$LANGSERVER_PATH_PREFIX/$LANGSERVER_LOG_FILE"

mkdir -p $LANGSERVER_PATH_PREFIX

echo "---------------"
echo "            pwd: " `pwd`
echo "   docker debug: " "$LANGSERVER_DOCKER_DEBUG"
echo "LOG_PATH_PREFIX: " $LOG_PATH_PREFIX
$LANGSERVER_DOCKER_DEBUG
echo "---------------"

source $NVM_DIR/nvm.sh

echo 'starting langserver'
langserver-go -mode ws -addr $LANGSERVER_ADDR -trace -logfile $LANGSERVER_LOG_PATH &

echo 'starting nginx'
# nginx

/bin/bash