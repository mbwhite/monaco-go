#!/bin/bash -x

# set -e -o pipefail
# trap 'jobs -p | xargs kill' EXIT

# shopt -s expand_aliases

# IMG_VOL_NAME="monaco-go-share"
# alias docker_find_vol='docker volume ls | grep "$IMG_VOL_NAME"'

# HAS_VOLUME=$(docker_find_vol)
# if [[ -z $HAS_VOLUME ]]; then
#   echo "creating volume"
# fi

# >>>>>>>>>>>>
IMAGE_NAME_PREFIX="mohamedbana"
IMG_NAME="nginx-monaco-go"
IMG_TAG="145a117"
IMG="$IMAGE_NAME_PREFIX/$IMG_NAME:$IMG_TAG"
# <<<<<<<<<<<<

# >>>>>>>>>>>>
IMG_RUNNING=$(docker ps -f ancestor=$IMG -q)
echo $IMG_RUNNING
[[ -n $IMG_RUNNING ]] && docker kill $ && sleep 2;
# <<<<<<<<<<<<

# >>>>>>>>>>>>
IMG_ALIAS="$IMG_NAME-running"
IMG_PORTS="-p 4389:4389 -p 22"
IMG_VOLS="\
-v $(pwd)/build/docker/entry/supervisord.conf:/etc/supervisor/conf.d/supervisord.conf"

docker run \
  -t --rm \
	$IMG_PORTS \
  $IMG_VOLS \
  --name $IMG_ALIAS \
	$IMG & sleep 2
# <<<<<<<<<<<<

# >>>>>>>>>>>>
PORT_SSH_DOCKER=$(docker port $IMG_ALIAS 22)
echo "$PORT_SSH_DOCKER"
# PORT_SSH=$(docker ps | ggrep -oP '[0-9]+(?=\->22)')
# echo "ssh root@localhost -p $PORT_SSH"
# <<<<<<<<<<<<

# IMG_PORTS_NGINX="-p 80:80 -p 443:443"
# IMG_VOL_NGINX="\
# -v /usr/local/go \
# -v /Users/mbana/go \
# "

# docker run \
#   -it \
#   --rm \
#   $IMG_PORTS_NGINX \
#    $IMG_VOLS_NGINX \
#   -v monaco-go-share:/Users/mbana \
#   ubuntu:14.04 /bin/bash
