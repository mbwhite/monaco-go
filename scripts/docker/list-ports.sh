#!/bin/bash -e

echo ">>>>>>>>>>>>"
echo "port $IMG_LANGSERVER"
PORT_SSH_DOCKER=$(docker port $IMG_ALIAS_LANGSERVER 22)
echo "$PORT_SSH_DOCKER"

echo "port $IMG_ALPINE"
echo $(docker port $IMG_ALIAS_ALPINE)
echo "<<<<<<<<<<<<"
echo ""