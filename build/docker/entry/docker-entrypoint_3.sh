#!/bin/bash

set -e

echo "---"
echo "BASHPID: $BASHPID"
ps -ef
echo "---"

HOME_ROOT="/root"

DOMAIN_NAME_TOP="bana.io"
DOMAIN_NAME_SUB="cloud"
DOMAIN_FULL="$DOMAIN_NAME_SUB.$DOMAIN_NAME_TOP"
DOMAIN_SUB_FOLDER="$DOMAIN_NAME_TOP/$DOMAIN_NAME_SUB"
LANGSERVER_PATH_PREFIX="/var/log/nginx/$DOMAIN_SUB_FOLDER"

LANGSERVER_DOCKER_DEBUG="$2"
LANGSERVER_ADDR=":$LANGSERVER_PORT"
LANGSERVER_LOG_FILE="go-langserver.log"
LANGSERVER_LOG_PATH="$LANGSERVER_PATH_PREFIX/$LANGSERVER_LOG_FILE"

mkdir -p $LANGSERVER_PATH_PREFIX
touch $LANGSERVER_LOG_PATH

mkdir -p /var/log/nginx/cloud.bana.io
touch /var/log/nginx/cloud.bana.io/error.log
mkdir /usr/share/nginx/logs
touch /usr/share/nginx/logs/access.log

mv /etc/nginx/nginx.conf $HOME_ROOT/nginx.conf.old
ln -s /entry/nginx.conf /etc/nginx
# cat /etc/nginx/nginx.conf

mkdir -p /var/www/html/cloud.bana.io
ln -s $HOME/monaco-go /var/www/html/cloud.bana.io/monaco-go

echo "---------------"
echo "            pwd: " `pwd`
echo "   docker debug: " "$LANGSERVER_DOCKER_DEBUG"
echo "LOG_PATH_PREFIX: " $LOG_PATH_PREFIX
$LANGSERVER_DOCKER_DEBUG
echo "---------------"

source "$NVM_DIR/nvm.sh"

CMD_LANGSERVER="langserver-go -mode ws -addr $LANGSERVER_ADDR -trace -logfile $LANGSERVER_LOG_PATH"
# nohup bash -c "$CMD_LANGSERVER 2>&1 &"
$CMD_LANGSERVER &
# sleep 1

# echo 'starting nginx'
# CMD_SERVER="nginx"
# # nohup bash -c "$CMD_SERVER 2>&1 &"
# $CMD_SERVER &
# sleep 1

# # tail -f $LANGSERVER_LOG_PATH &
# tail -f nohup.out &

# echo "---"
# echo "BASHPID: $BASHPID"
# ps -ef
# echo "---"

# export START_COMMAND='tail -f nohup.out'
