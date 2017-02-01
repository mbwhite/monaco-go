#!/bin/bash -e

PORTS_LANGSERVER=$(docker port $IMG_ALIAS_LANGSERVER 22 | cut -d ':' -f 2)

echo ">>>>>>>>>>>>"
echo "waiting:
$IMG_LANGSERVER
$ID_LANGSERVER
ssh root@localhost -p $PORTS_LANGSERVER

$IMG_ALPINE
$ID_NGINX
docker exec -it $ID_NGINX sh

..."

docker wait $ID_LANGSERVER $ID_NGINX
docker rm $ID_LANGSERVER $ID_NGINX

echo "killed: $ID_LANGSERVER $ID_NGINX"
echo "docker ps: $(docker ps)"
echo "docker ps -a: $(docker ps -a)"
echo "<<<<<<<<<<<<"