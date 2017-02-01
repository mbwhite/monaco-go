#!/bin/bash
set -e

exec 3>&2 2>&1 1>&3

echo ">>>>>>>>>>>>"
echo "start $IMG_ALPINE"
IMG_PORTS_ALPINE="-p 80:80 -p 443:443"
IMG_VOLS_ALPINE="\
-v $IMG_VOL_SHARED:/Users/mbana \
-v $(pwd)/build/docker/nginx-alpine/docker-entrypoint.sh:/docker-entrypoint.sh:ro \
-v $(pwd)/build/nginx/nginx.conf:/etc/nginx/nginx.conf:ro \
-v /Users/mbana/dev/server/ssl/cloud.bana.io_bk:/etc/nginx/certs:ro"

ID_NGINX=$(docker run --name $IMG_ALIAS_ALPINE -d $IMG_VOLS_ALPINE $IMG_PORTS_ALPINE $IMG_ALPINE)
sleep 5
echo >&2 $(echo $ID_NGINX)
echo "<<<<<<<<<<<<"