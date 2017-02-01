#!/bin/bash -e

echo ">>>>>>>>>>>>"
echo "killing old"
# [[ ! -d $IMG_VOL_SHARED ]] && \
#   echo "!!! IMG_VOL_SHARED: $IMG_VOL_SHARED"

# [[ -d $IMG_VOL_SHARED ]] && \
#   echo "IMG_VOL_SHARED: $IMG_VOL_SHARED"

docker ps

IMG_RUNNING_ALPINE=$(docker ps -f name=$IMG_ALIAS_APLINE -q)
[[ ! -z $IMG_RUNNING_ALPINE ]] && \
  docker kill $IMG_RUNNING_ALPINE && \
  sleep 2 && \
  echo "killed: $IMG_ALPINE:$IMG_RUNNING_ALPINE"

IMG_RUNNING_LANGSERVER=$(docker ps -f name=$IMG_ALIAS_LANGSERVER -q)
[[ ! -z $IMG_RUNNING_LANGSERVER ]] && \
  docker kill $IMG_RUNNING_LANGSERVER && \
  sleep 2 && \
  echo "killed: $IMG_LANGSERVER:$IMG_RUNNING_LANGSERVER"


IMG_RUNNING_ALPINE_STALE=$(docker ps -a -f name=$IMG_ALIAS_APLINE -q)
[[ ! -z $IMG_RUNNING_ALPINE_STALE ]] && \
  docker rm $IMG_RUNNING_ALPINE_STALE && \
  echo "docker rm: $IMG_ALPINE" && \
  sleep 2

IMG_RUNNING_LANGSERVER_STALE=$(docker ps -a -f name=$IMG_ALIAS_LANGSERVER -q)
[[ ! -z $IMG_RUNNING_LANGSERVER_STALE ]] && \
  docker rm $IMG_RUNNING_LANGSERVER_STALE && \
  echo "docker rm: $IMG_LANGSERVER" && \
  sleep 2

# [[ -z $IMG_RUNNING_ALPINE ]] && \
#   docker kill $IMG_ALIAS_APLINE && \
#   echo "killed: $IMG_ALIAS_APLINE"

# [[ -z $IMG_RUNNING_LANGSERVER ]] && \
#   docker kill $IMG_ALIAS_LANGSERVER && \
#   echo "killed: $IMG_ALIAS_LANGSERVER"

echo "<<<<<<<<<<<<"