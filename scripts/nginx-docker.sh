#!/bin/bash -x

# capture errors and export all
set -e
set -a

SCRIPTS_DIR=$(dirname "$0")

# >>>>>>>>>>>>
# vars
GIT_REV=$(git rev-parse --short HEAD)
IMAGE_NAME_PREFIX="mohamedbana"
IMG_TAG=$GIT_REV

IMG_NAME="nginx-monaco-go"
# IMG_TAG="145a117"
IMG_LANGSERVER="$IMAGE_NAME_PREFIX/$IMG_NAME:$IMG_TAG"
IMG_ALIAS_LANGSERVER="$IMG_NAME-running"

IMAGE_ALPINE_NAME="nginx-alpine"
IMAGE_ALPINE="$IMAGE_NAME_PREFIX/$IMAGE_ALPINE_NAME"
IMG_ALPINE="$IMAGE_ALPINE:$IMG_TAG"
# IMG_ALIAS_ALPINE="$IMAGE_ALPINE_NAME-running"
IMG_ALIAS_ALPINE="some-nginx"

IMG_VOL_SHARED="monaco-go-volume"
IMG_VOL_HOST_PATH="/Users/mbana"
# <<<<<<<<<<<<

$SCRIPTS_DIR/docker/kill-all.sh
$SCRIPTS_DIR/docker/vols-remove.sh
$SCRIPTS_DIR/docker/kill-all.sh

ID_LANGSERVER=$($SCRIPTS_DIR/docker/start-langserver.sh)
ID_NGINX=$($SCRIPTS_DIR/docker/start-nginx.sh)

$SCRIPTS_DIR/docker/list-ports.sh
$SCRIPTS_DIR/docker/wait.sh

$SCRIPTS_DIR/docker/kill-all.sh
$SCRIPTS_DIR/docker/vols-remove.sh
$SCRIPTS_DIR/docker/kill-all.sh
