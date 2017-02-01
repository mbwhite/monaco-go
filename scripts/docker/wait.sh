#!/bin/bash
set -e

echo ">>>>>>>>>>>>"
echo "waiting:

$IMG_LANGSERVER
$ID_LANGSERVER

$IMG_ALPINE
$ID_NGINX

..."

docker wait $ID_LANGSERVER $ID_NGINX
docker rm $ID_LANGSERVER $ID_NGINX

echo "killed: $ID_LANGSERVER $ID_NGINX"
echo "docker ps: $(docker ps)"
echo "docker ps -a: $(docker ps -a)"
echo "<<<<<<<<<<<<"