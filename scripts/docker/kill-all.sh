#!/bin/bash -e

echo ">>>>>>>>>>>>"
echo "killing old"
# [[ ! -d $IMG_VOL_SHARED ]] && \
#   echo "!!! IMG_VOL_SHARED: $IMG_VOL_SHARED"

[[ -d $IMG_VOL_SHARED ]] && \
  echo "IMG_VOL_SHARED: $IMG_VOL_SHARED"

IMG_RUNNING_LANGSERVER=$(docker ps -f ancestor=$IMG_LANGSERVER -q)
[[ ! -z $IMG_RUNNING_LANGSERVER ]] && \
  docker kill $IMG_RUNNING_LANGSERVER && \
  sleep 2 && \
  echo "killed: $IMG_LANGSERVER:$IMG_RUNNING_LANGSERVER"

IMG_RUNNING_ALPINE=$(docker ps -f ancestor=$IMG_ALPINE -q)
[[ ! -z $IMG_RUNNING_ALPINE ]] && \
  docker kill $IMG_RUNNING_ALPINE && \
  sleep 2 && \
  echo "killed: $IMG_ALPINE:$IMG_RUNNING_ALPINE"

[[ -z $IMG_RUNNING_LANGSERVER ]] && [[ -z $IMG_RUNNING_ALPINE ]] && \
  docker kill $IMG_ALIAS_LANGSERVER $IMG_ALIAS_APLINE && \
  echo "killed: $IMG_ALIAS_LANGSERVER $IMG_ALIAS_APLINE"

echo "<<<<<<<<<<<<"