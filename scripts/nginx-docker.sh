#!/bin/bash

# capture errors and export all
set -e
set -a

SCRIPTS_DIR=$(dirname "$0")

# >>>>>>>>>>>>
# vars
GIT_REV=$(git rev-parse --short HEAD)
IMAGE_NAME_PREFIX="mohamedbana"
# IMG_TAG=$GIT_REV
IMG_TAG="7c2c12b"

IMG_NAME="monaco-go_go-langserver"
# IMG_TAG="145a117"
IMG_LANGSERVER="$IMAGE_NAME_PREFIX/$IMG_NAME:$IMG_TAG"
IMG_ALIAS_LANGSERVER="$IMG_NAME-up"

IMAGE_ALPINE_NAME="monaco-go_nginx"
IMAGE_ALPINE="$IMAGE_NAME_PREFIX/$IMAGE_ALPINE_NAME"
IMG_ALPINE="$IMAGE_ALPINE:$IMG_TAG"
IMG_ALIAS_ALPINE="$IMAGE_ALPINE_NAME-up"

IMG_VOL_SHARED="monaco-go-volume"
IMG_VOL_HOST_PATH="/Users/mbana"
# <<<<<<<<<<<<

$SCRIPTS_DIR/docker/kill-all.sh
$SCRIPTS_DIR/docker/vols-remove.sh
$SCRIPTS_DIR/docker/kill-all.sh

ID_LANGSERVER=$($SCRIPTS_DIR/docker/start-langserver.sh)
ID_NGINX=$($SCRIPTS_DIR/docker/start-nginx.sh)

echo ">>>>>>>>>>>>"
echo "   docker ps: $(docker ps)"
echo "docker ps -a: $(docker ps -a)"
echo "<<<<<<<<<<<<"
echo ""

$SCRIPTS_DIR/docker/list-ports.sh
$SCRIPTS_DIR/docker/wait.sh

$SCRIPTS_DIR/docker/kill-all.sh
$SCRIPTS_DIR/docker/vols-remove.sh
$SCRIPTS_DIR/docker/kill-all.sh

echo ">>>>>>>>>>>>"
echo "   docker ps: $(docker ps)"
echo "docker ps -a: $(docker ps -a)"
echo "<<<<<<<<<<<<"